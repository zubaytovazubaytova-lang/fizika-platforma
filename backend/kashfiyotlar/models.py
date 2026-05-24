from django.db import models


class Kashfiyot(models.Model):
    class Kategoriya(models.TextChoices):
        IXTIROLAR  = 'ixtirolar',  'Ixtirolar'
        TAJRIBALAR = 'tajribalar', 'Tajribalar'
        SANALAR    = 'sanalar',    'Sanalar'
        OLIMLAR    = 'olimlar',    'Olimlar'
        REKORDLAR  = 'rekordlar',  'Rekordlar'

    title       = models.CharField('Sarlavha', max_length=255)
    description = models.TextField('Tavsif')
    image       = models.ImageField('Rasm', upload_to='kashfiyotlar/', blank=True, null=True)
    kategoriya  = models.CharField(
        'Kategoriya', max_length=20,
        choices=Kategoriya.choices, default=Kategoriya.IXTIROLAR,
    )
    is_published = models.BooleanField('Nashr etilgan', default=True)
    order        = models.PositiveIntegerField('Tartib', default=0)
    created_at   = models.DateTimeField('Yaratilgan', auto_now_add=True)
    updated_at   = models.DateTimeField('Yangilangan', auto_now=True)

    class Meta:
        verbose_name        = 'Kashfiyot'
        verbose_name_plural = 'Kashfiyotlar'
        ordering            = ['order', '-created_at']

    def __str__(self):
        return self.title


class IxtirolarProxy(Kashfiyot):
    class Meta:
        proxy = True
        verbose_name = 'Ixtiro'
        verbose_name_plural = 'Ixtirolar'


class TajribalarProxy(Kashfiyot):
    class Meta:
        proxy = True
        verbose_name = 'Tajriba'
        verbose_name_plural = 'Tajribalar'


class SanalarProxy(Kashfiyot):
    class Meta:
        proxy = True
        verbose_name = 'Sana'
        verbose_name_plural = 'Sanalar'


class OlimlarProxy(Kashfiyot):
    class Meta:
        proxy = True
        verbose_name = 'Olim'
        verbose_name_plural = 'Olimlar'


class RekordlarProxy(Kashfiyot):
    class Meta:
        proxy = True
        verbose_name = 'Rekord'
        verbose_name_plural = 'Rekordlar'
