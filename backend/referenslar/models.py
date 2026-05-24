from django.db import models


class Formula(models.Model):
    class Kategoriya(models.TextChoices):
        MEXANIKA      = 'mexanika',      'Mexanika'
        ELEKTR        = 'elektr',        'Elektr va magnit'
        OPTIKA        = 'optika',        'Optika'
        TERMODINAMIKA = 'termodinamika', 'Termodinamika'
        KVANT         = 'kvant',         'Kvant fizikasi'
        BOSHQA        = 'boshqa',        'Boshqa'

    title       = models.CharField('Sarlavha', max_length=255)
    formula     = models.CharField('Formula', max_length=255,
                                   help_text='Masalan: F = ma, T = 2π√(L/g)')
    description = models.TextField('Tavsif', blank=True)
    kategoriya  = models.CharField('Kategoriya', max_length=20,
                                   choices=Kategoriya.choices,
                                   default=Kategoriya.MEXANIKA)
    image       = models.ImageField('Rasm', upload_to='formulalar/', blank=True, null=True)
    is_published = models.BooleanField('Nashr etilgan', default=True)
    order       = models.PositiveIntegerField('Tartib', default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = 'Formula'
        verbose_name_plural = 'Formulalar'
        ordering            = ['order', 'title']

    def __str__(self):
        return f'{self.title} — {self.formula}'


class FizikKattaik(models.Model):
    nomi           = models.CharField('Nomi', max_length=255)
    belgi          = models.CharField('Belgisi', max_length=50,
                                      help_text='Masalan: F, m, v, a')
    olchov_birligi = models.CharField("O'lchov birligi", max_length=100,
                                      help_text='Masalan: N, kg, m/s, m/s²')
    description    = models.TextField('Tavsif', blank=True)
    is_published   = models.BooleanField('Nashr etilgan', default=True)
    order          = models.PositiveIntegerField('Tartib', default=0)

    class Meta:
        verbose_name        = 'Fizik kattaik'
        verbose_name_plural = 'Fizik kattaliklar'
        ordering            = ['order', 'nomi']

    def __str__(self):
        return f'{self.nomi} ({self.belgi})'


class FizikBirlik(models.Model):
    class Sistema(models.TextChoices):
        SI    = 'SI',    'SI (Xalqaro sistema)'
        CGS   = 'CGS',   'CGS'
        BOSHQA = 'boshqa', 'Boshqa'

    nomi        = models.CharField('Nomi', max_length=255,
                                   help_text='Masalan: Nyuton, Joul, Vatt')
    belgi       = models.CharField('Belgisi', max_length=50,
                                   help_text='Masalan: N, J, W')
    sistema     = models.CharField('O\'lchov sistemasi', max_length=10,
                                   choices=Sistema.choices, default=Sistema.SI)
    description = models.TextField('Tavsif', blank=True)
    is_published = models.BooleanField('Nashr etilgan', default=True)
    order       = models.PositiveIntegerField('Tartib', default=0)

    class Meta:
        verbose_name        = 'Fizik birlik'
        verbose_name_plural = 'Fizik birliklar'
        ordering            = ['sistema', 'order', 'nomi']

    def __str__(self):
        return f'{self.nomi} ({self.belgi}) — {self.sistema}'


# ── Formula proxy models (kategoriya bo'yicha) ───────────────────────────────

class FormulaMexanika(Formula):
    class Meta:
        proxy = True
        verbose_name = 'Mexanika formulasi'
        verbose_name_plural = 'Mexanika'

class FormulaElektr(Formula):
    class Meta:
        proxy = True
        verbose_name = 'Elektr formulasi'
        verbose_name_plural = 'Elektr va magnit'

class FormulaOptika(Formula):
    class Meta:
        proxy = True
        verbose_name = 'Optika formulasi'
        verbose_name_plural = 'Optika'

class FormulaTermodinamika(Formula):
    class Meta:
        proxy = True
        verbose_name = 'Termodinamika formulasi'
        verbose_name_plural = 'Termodinamika'

class FormulaKvant(Formula):
    class Meta:
        proxy = True
        verbose_name = 'Kvant formulasi'
        verbose_name_plural = 'Kvant fizikasi'


# ── FizikBirlik proxy models (sistema bo'yicha) ───────────────────────────────

class FizikBirlikSI(FizikBirlik):
    class Meta:
        proxy = True
        verbose_name = 'SI birligi'
        verbose_name_plural = 'SI birliklari'

class FizikBirlikCGS(FizikBirlik):
    class Meta:
        proxy = True
        verbose_name = 'CGS birligi'
        verbose_name_plural = 'CGS birliklari'
