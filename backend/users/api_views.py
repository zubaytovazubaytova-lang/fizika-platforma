from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
import random
import logging
import requests as http_requests

from .models import CustomUser, PhoneOTP, EmailOTP
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UserDetailSerializer,
    ChangePasswordSerializer,
    LogoutSerializer,
)

logger = logging.getLogger(__name__)

# ── Eskiz.uz SMS ──────────────────────────────────────────────────────────────

_eskiz_token_cache: dict = {}


def _get_eskiz_token() -> str:
    """Eskiz.uz dan token oladi yoki cache dan qaytaradi."""
    import time
    cached = _eskiz_token_cache.get("token")
    expires_at = _eskiz_token_cache.get("expires_at", 0)
    if cached and time.time() < expires_at:
        return cached

    resp = http_requests.post(
        "https://notify.eskiz.uz/api/auth/login",
        data={"email": settings.ESKIZ_EMAIL, "password": settings.ESKIZ_PASSWORD},
        timeout=10,
    )
    resp.raise_for_status()
    token = resp.json()["data"]["token"]
    _eskiz_token_cache["token"] = token
    _eskiz_token_cache["expires_at"] = time.time() + 82800  # ~23 soat
    return token


def send_sms(phone: str, code: str) -> None:
    """Eskiz.uz orqali SMS yuboradi. Sozlamalar bo'lmasa — consolega chiqaradi."""
    if not settings.ESKIZ_EMAIL or not settings.ESKIZ_PASSWORD:
        logger.info("[SMS MOCK] Code for %s: %s", phone, code)
        print(f"[SMS MOCK] Code for {phone}: {code}")
        return

    message = f"Fizika platform tasdiqlash kodi: {code}. Uni hech kimga bermang."
    headers = {"Authorization": f"Bearer {_get_eskiz_token()}"}
    payload = {"mobile_phone": phone, "message": message, "from": settings.ESKIZ_FROM}

    resp = http_requests.post(
        "https://notify.eskiz.uz/api/message/sms/send",
        headers=headers, data=payload, timeout=10,
    )
    if resp.status_code == 401:
        # Token eskirgan — yangilab qayta urinish
        _eskiz_token_cache.clear()
        headers["Authorization"] = f"Bearer {_get_eskiz_token()}"
        resp = http_requests.post(
            "https://notify.eskiz.uz/api/message/sms/send",
            headers=headers, data=payload, timeout=10,
        )
    resp.raise_for_status()
    logger.info("[SMS] Sent to %s: %s", phone, resp.json())


# ── Email OTP ─────────────────────────────────────────────────────────────────

def send_email_otp(email: str, code: str) -> None:
    """Django email backend orqali OTP yuboradi."""
    subject = "Fizika Platform — tasdiqlash kodi"
    body = (
        "Assalomu alaykum!\n\n"
        f"Sizning tasdiqlash kodingiz: {code}\n\n"
        "Kod 10 daqiqa davomida amal qiladi. Uni hech kimga bermang.\n\n"
        "Fizika Platform"
    )
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
    logger.info("[EMAIL] OTP sent to %s", email)


# ── SMS: kod yuborish / tasdiqlash ───────────────────────────────────────────

class SendCodeView(APIView):
    """
    POST /api/auth/send-code/
    { phone }
    -> { detail }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        if not phone:
            return Response({"detail": "Telefon raqam kerak."}, status=status.HTTP_400_BAD_REQUEST)
        code = f"{random.randint(0, 999999):06d}"
        PhoneOTP.objects.update_or_create(
            phone=phone,
            defaults={"code": code, "created_at": timezone.now(), "verified": False, "attempts": 0},
        )
        try:
            send_sms(phone, code)
        except Exception as exc:
            logger.error("SMS yuborishda xato %s: %s", phone, exc)
            return Response(
                {"detail": "SMS yuborishda xato yuz berdi. Keyinroq urinib ko'ring."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({"detail": "Kod yuborildi."})


class VerifyCodeView(APIView):
    """
    POST /api/auth/verify-code/
    { phone, code }
    -> on success: { access, refresh, user }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        code = request.data.get("code")
        if not phone or not code:
            return Response({"detail": "Telefon va kod kerak."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            otp = PhoneOTP.objects.get(phone=phone)
        except PhoneOTP.DoesNotExist:
            return Response(
                {"detail": "Kod topilmadi. Iltimos avval kod so'rang."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if otp.created_at < timezone.now() - timedelta(minutes=10):
            return Response(
                {"detail": "Kod muddati o'tgan. Yangi kod so'rang."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if otp.attempts >= 5:
            return Response(
                {"detail": "Juda ko'p urinishlar. Keyinroq urinib ko'ring."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        if otp.code != code:
            otp.attempts += 1
            otp.save(update_fields=["attempts"])
            return Response({"detail": "Kod noto'g'ri."}, status=status.HTTP_400_BAD_REQUEST)

        otp.verified = True
        otp.save(update_fields=["verified"])

        user, _ = CustomUser.objects.get_or_create(
            phone=phone, defaults={"username": phone, "first_name": "", "last_name": ""},
        )
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserDetailSerializer(user).data,
        })


# ── Email: kod yuborish / tasdiqlash ─────────────────────────────────────────

class SendEmailCodeView(APIView):
    """
    POST /api/auth/send-email-code/
    { email }
    -> { detail }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        if not email:
            return Response({"detail": "Email manzil kerak."}, status=status.HTTP_400_BAD_REQUEST)
        code = f"{random.randint(0, 999999):06d}"
        EmailOTP.objects.update_or_create(
            email=email,
            defaults={"code": code, "created_at": timezone.now(), "verified": False, "attempts": 0},
        )
        try:
            send_email_otp(email, code)
        except Exception as exc:
            logger.error("Email yuborishda xato %s: %s", email, exc)
            return Response(
                {"detail": "Email yuborishda xato yuz berdi. Keyinroq urinib ko'ring."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({"detail": "Kod emailga yuborildi."})


class VerifyEmailCodeView(APIView):
    """
    POST /api/auth/verify-email-code/
    { email, code }
    -> { detail, verified } — faqat tasdiqlash (login emas)
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        code = request.data.get("code", "").strip()
        if not email or not code:
            return Response({"detail": "Email va kod kerak."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            otp = EmailOTP.objects.get(email=email)
        except EmailOTP.DoesNotExist:
            return Response(
                {"detail": "Kod topilmadi. Iltimos avval kod so'rang."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if otp.created_at < timezone.now() - timedelta(minutes=10):
            return Response(
                {"detail": "Kod muddati o'tgan. Yangi kod so'rang."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if otp.attempts >= 5:
            return Response(
                {"detail": "Juda ko'p urinishlar. Keyinroq urinib ko'ring."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        if otp.code != code:
            otp.attempts += 1
            otp.save(update_fields=["attempts"])
            return Response({"detail": "Kod noto'g'ri."}, status=status.HTTP_400_BAD_REQUEST)

        otp.verified = True
        otp.save(update_fields=["verified"])
        return Response({"detail": "Email muvaffaqiyatli tasdiqlandi.", "verified": True})


# ── Login ─────────────────────────────────────────────────────────────────────

class LoginRateThrottle(AnonRateThrottle):
    """Login uchun qattiqroq limit: soatiga 10 urinish."""
    scope = 'login'


class LoginView(TokenObtainPairView):
    """
    POST /api/auth/login/
    { username, password }
    -> { access, refresh, user: {...} }
    """
    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes  = [LoginRateThrottle]


# ── Ro'yxatdan o'tish ─────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    { username, email, first_name, last_name, password, password2 }
    -> { access, refresh, user: {...} }
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserDetailSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ── Logout ────────────────────────────────────────────────────────────────────

class LogoutView(APIView):
    """
    POST /api/auth/logout/
    { refresh: "<refresh_token>" }
    -> 205 Reset Content
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            token = RefreshToken(serializer.validated_data["refresh"])
            token.blacklist()
        except TokenError:
            return Response(
                {"detail": "Token yaroqsiz yoki allaqachon bekor qilingan."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_205_RESET_CONTENT)


# ── Token yangilash ───────────────────────────────────────────────────────────

class TokenRefreshWithUserView(APIView):
    """
    POST /api/auth/token/refresh/
    { refresh: "<refresh_token>" }
    -> { access, refresh, user: {...} }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "refresh maydoni kerak."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh.payload.get("user_id")
            user = CustomUser.objects.get(pk=user_id)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserDetailSerializer(user).data,
            })
        except (TokenError, InvalidToken):
            return Response(
                {"detail": "Refresh token yaroqsiz yoki muddati o'tgan."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"detail": "Foydalanuvchi topilmadi."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


# ── Mening profilim ───────────────────────────────────────────────────────────

class MeView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/auth/me/   -> profilni ko'rish
    PUT   /api/auth/me/   -> to'liq yangilash
    PATCH /api/auth/me/   -> qisman yangilash
    """
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ── Parol o'zgartirish ────────────────────────────────────────────────────────

class ChangePasswordView(APIView):
    """
    POST /api/auth/change-password/
    { old_password, new_password, new_password2 }
    -> { detail }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Parol muvaffaqiyatli o'zgartirildi. Iltimos qayta kiring."},
            status=status.HTTP_200_OK,
        )
