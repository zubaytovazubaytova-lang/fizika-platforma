from django.db import models


class Darslik(models.Model):
    grade    = models.IntegerField(verbose_name='Sinf')
    subject  = models.CharField(max_length=100, verbose_name='Fan nomi')
    subtitle = models.CharField(max_length=200, verbose_name='Qo\'shimcha sarlavha')
    icon     = models.CharField(max_length=10, default='📚', verbose_name='Emoji icon')
    color    = models.CharField(max_length=20, default='#34D399', verbose_name='Asosiy rang')
    accent   = models.CharField(max_length=20, default='#059669', verbose_name='Accent rang')
    formulas = models.JSONField(default=list, verbose_name='Formulalar')
    chapters = models.IntegerField(default=0, verbose_name='Boblar soni')
    pages    = models.IntegerField(default=0, verbose_name='Sahifalar soni')
    mavzular = models.JSONField(
        default=list, blank=True,
        verbose_name='Mavzular',
        help_text='[{"mavzu": "Mexanika asoslari", "bet": 12}, ...]',
    )
    is_published = models.BooleanField(default=True, verbose_name='Chop etilgan')
    order        = models.IntegerField(default=0, verbose_name='Tartib')

    class Meta:
        verbose_name        = 'Darslik'
        verbose_name_plural = 'Darsliklar'
        ordering            = ['grade', 'order']

    def __str__(self):
        return f"{self.grade}-sinf: {self.subject}"


class Mavzu(models.Model):
    darslik  = models.ForeignKey(
        Darslik, on_delete=models.CASCADE,
        related_name='mavzu_set', verbose_name='Darslik'
    )
    mavzu    = models.CharField(max_length=300, verbose_name='Mavzu nomi')
    bet      = models.IntegerField(verbose_name='Bet raqami')
    bob      = models.IntegerField(default=0, blank=True, verbose_name='Bob raqami')
    order    = models.IntegerField(default=0, verbose_name='Tartib')
    pdf_file = models.FileField(
        upload_to='mavzular/pdf/', null=True, blank=True,
        verbose_name='PDF fayl'
    )

    class Meta:
        verbose_name        = 'Mavzu'
        verbose_name_plural = 'Mavzular'
        ordering            = ['darslik__grade', 'bob', 'order', 'bet']

    def __str__(self):
        return f"{self.darslik.grade}-sinf | {self.mavzu} — {self.bet}-bet"
