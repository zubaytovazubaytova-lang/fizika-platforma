from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'student', 'Talaba'
        TEACHER = 'teacher', "O'qituvchi"
        ADMIN   = 'admin',   'Admin'

    role   = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)
    bio    = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    phone  = models.CharField(max_length=20, blank=True)

    # Soft delete — foydalanuvchi o'chirilmaydi, faqat belgilanadi
    is_deleted  = models.BooleanField(default=False, db_index=True)
    deleted_at  = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
            models.Index(fields=['is_deleted']),
        ]

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"

    def soft_delete(self):
        """Foydalanuvchini o'chirish o'rniga faolsizlashtirish."""
        self.is_active  = False
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_active', 'is_deleted', 'deleted_at'])

    def restore(self):
        """O'chirilgan foydalanuvchini tiklash."""
        self.is_active  = True
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_active', 'is_deleted', 'deleted_at'])

    @property
    def is_teacher(self):
        return self.role == self.Role.TEACHER

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT


class PhoneOTP(models.Model):
    phone      = models.CharField(max_length=32, unique=True)
    code       = models.CharField(max_length=8)
    created_at = models.DateTimeField(auto_now_add=True)
    verified   = models.BooleanField(default=False)
    attempts   = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.phone} - {'verified' if self.verified else 'pending'}"


class EmailOTP(models.Model):
    email      = models.EmailField(unique=True)
    code       = models.CharField(max_length=8)
    created_at = models.DateTimeField(auto_now_add=True)
    verified   = models.BooleanField(default=False)
    attempts   = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.email} - {'verified' if self.verified else 'pending'}"
