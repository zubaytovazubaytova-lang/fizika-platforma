from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser


# ── Foydalanuvchi ma'lumotlari ──────────────────────────────────────────────

class UserPublicSerializer(serializers.ModelSerializer):
    """Boshqalar uchun — faqat ochiq maydonlar."""
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'full_name', 'role', 'avatar', 'bio')

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class UserDetailSerializer(serializers.ModelSerializer):
    """Foydalanuvchi o'zi uchun — to'liq ma'lumot."""
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email',
            'first_name', 'last_name', 'full_name',
            'role', 'avatar', 'bio', 'phone', 'date_joined',
        )
        read_only_fields = ('id', 'username', 'role', 'date_joined')

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


# ── Login (JWT + user ma'lumoti) ─────────────────────────────────────────────

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Login javobiga user ma'lumotini ham qo'shadi:
    { access, refresh, user: {...} }
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserDetailSerializer(self.user).data
        return data


# ── Ro'yxatdan o'tish ────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, label='Parolni tasdiqlang')

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password2')
        extra_kwargs = {
            'email':      {'required': True},
            'first_name': {'required': True},
            'last_name':  {'required': True},
        }

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('Bu email allaqachon ro\'yxatdan o\'tgan.')
        return value

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError('Bu foydalanuvchi nomi band.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Parollar mos kelmadi.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        return CustomUser.objects.create_user(**validated_data)


# ── Parol o'zgartirish ───────────────────────────────────────────────────────

class ChangePasswordSerializer(serializers.Serializer):
    old_password  = serializers.CharField(write_only=True)
    new_password  = serializers.CharField(write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(write_only=True, label='Yangi parolni tasdiqlang')

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Joriy parol noto\'g\'ri.')
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({'new_password': 'Yangi parollar mos kelmadi.'})
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user


# ── Logout ───────────────────────────────────────────────────────────────────

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
