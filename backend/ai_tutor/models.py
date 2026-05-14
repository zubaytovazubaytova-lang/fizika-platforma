from django.db import models
from django.conf import settings


class Conversation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations')
    title = models.CharField(max_length=200, default='Yangi suhbat')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Suhbat'
        verbose_name_plural = 'Suhbatlar'
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username}: {self.title}"

    @property
    def last_message(self):
        return self.messages.last()


class Message(models.Model):
    class Role(models.TextChoices):
        USER = 'user', 'Foydalanuvchi'
        ASSISTANT = 'assistant', 'AI Tutor'

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=Role.choices)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Xabar'
        verbose_name_plural = 'Xabarlar'
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.get_role_display()}] {self.content[:80]}"
