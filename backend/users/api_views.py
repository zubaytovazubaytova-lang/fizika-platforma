from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from .models import CustomUser
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UserDetailSerializer,
    ChangePasswordSerializer,
    LogoutSerializer,
)


# ── Login ─────────────────────────────────────────────────────────────────────

class LoginView(TokenObtainPairView):
    """
    POST /api/auth/login/
    { username, password }
    → { access, refresh, user: {...} }
    """
    serializer_class = CustomTokenObtainPairSerializer


# ── Ro'yxatdan o'tish ─────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    { username, email, first_name, last_name, password, password2 }
    → { access, refresh, user: {...} }
    Ro'yxatdan o'tgach darhol token beriladi — alohida login kerak emas.
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
                'access':  str(refresh.access_token),
                'refresh': str(refresh),
                'user':    UserDetailSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ── Logout ────────────────────────────────────────────────────────────────────

class LogoutView(APIView):
    """
    POST /api/auth/logout/
    { refresh: "<refresh_token>" }
    → 205 Reset Content

    Refresh tokenni blacklistga qo'shadi — eski tokenlar endi ishlamaydi.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            token = RefreshToken(serializer.validated_data['refresh'])
            token.blacklist()
        except TokenError:
            return Response(
                {'detail': 'Token yaroqsiz yoki allaqachon bekor qilingan.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_205_RESET_CONTENT)


# ── Token yangilash ───────────────────────────────────────────────────────────

class TokenRefreshWithUserView(APIView):
    """
    POST /api/auth/token/refresh/
    { refresh: "<refresh_token>" }
    → { access, refresh, user: {...} }

    Oddiy SimpleJWT refresh dan farqi: yangilangan user ma'lumotini ham qaytaradi.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'detail': 'refresh maydoni kerak.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh.payload.get('user_id')
            user = CustomUser.objects.get(pk=user_id)
            return Response({
                'access':  str(refresh.access_token),
                'refresh': str(refresh),
                'user':    UserDetailSerializer(user).data,
            })
        except (TokenError, InvalidToken):
            return Response(
                {'detail': 'Refresh token yaroqsiz yoki muddati o\'tgan.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except CustomUser.DoesNotExist:
            return Response(
                {'detail': 'Foydalanuvchi topilmadi.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )


# ── Mening profilim ───────────────────────────────────────────────────────────

class MeView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/auth/me/  → profilni ko'rish
    PUT  /api/auth/me/  → to'liq yangilash
    PATCH /api/auth/me/ → qisman yangilash (faqat kerakli maydonlar)
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
    → { detail: "Parol muvaffaqiyatli o'zgartirildi." }

    Parol o'zgargach barcha tokenlar bekor qilinadi — qayta login kerak.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': "Parol muvaffaqiyatli o'zgartirildi. Iltimos qayta kiring."},
            status=status.HTTP_200_OK,
        )
