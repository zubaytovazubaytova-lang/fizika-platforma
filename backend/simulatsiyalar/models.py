from django.db import models


class Simulatsiya(models.Model):
    class Kategoriya(models.TextChoices):
        MEXANIKA      = 'mexanika',      'Mexanika'
        ELEKTR        = 'elektr',        'Elektr va Magnit'
        OPTIKA        = 'optika',        'Optika'
        TERMODINAMIKA = 'termodinamika', 'Termodinamika'
        KVANT         = 'kvant',         'Kvant fizikasi'
        BOSHQA        = 'boshqa',        'Boshqa'

    # Asosiy maydonlar
    title       = models.CharField('Sarlavha', max_length=255)
    slug        = models.SlugField(
        'Slug (komponent ID)',
        unique=True,
        help_text='Frontendda qaysi 3D komponent yuklanishini belgilaydi. Masalan: pendulum',
    )
    description = models.TextField('Tavsif')
    kategoriya  = models.CharField(
        'Kategoriya', max_length=20,
        choices=Kategoriya.choices, default=Kategoriya.MEXANIKA,
    )

    # Parametrlar — JSON formatda: {"uzunlik": {"label": "Uzunlik (m)", "min": 0.5, "max": 3.0, "default": 1.0, "step": 0.1}}
    parametrlar = models.JSONField(
        'Parametrlar',
        default=dict,
        blank=True,
        help_text=(
            'JSON formatda. Masalan: '
            '{"uzunlik": {"label": "Uzunlik (m)", "min": 0.5, "max": 3.0, "default": 1.0, "step": 0.1}}'
        ),
    )

    # Fizika formulasi va qo'shimcha ma'lumot
    formula   = models.CharField('Formula', max_length=255, blank=True,
                                 help_text='Masalan: T = 2π√(L/g)')
    info_text = models.TextField('Qo\'shimcha ma\'lumot', blank=True,
                                 help_text='Simulatsiya ostida ko\'rinadigan tushuntirish matni')

    # Ko'rinish sozlamalari
    icon_name  = models.CharField(
        'Icon nomi', max_length=50, default='Atom',
        help_text='Lucide icon nomi: Atom, Clock, Zap, Waves, Thermometer ...',
    )
    color      = models.CharField(
        'Rang (Tailwind class)', max_length=60, default='text-blue-400',
        help_text='Masalan: text-blue-400, text-yellow-400, text-purple-400',
    )

    # Holat
    tez_orada    = models.BooleanField(
        '"Tez orada" belgisi', default=False,
        help_text='Yoqilsa simulatsiya o\'chiriladi va "Tez orada" belgisi chiqadi',
    )
    is_published = models.BooleanField('Nashr etilgan', default=True)
    order        = models.PositiveIntegerField('Tartib', default=0)

    created_at = models.DateTimeField('Yaratilgan', auto_now_add=True)
    updated_at = models.DateTimeField('Yangilangan', auto_now=True)

    class Meta:
        verbose_name        = 'Simulatsiya'
        verbose_name_plural = '3D Simulatsiyalar'
        ordering            = ['order', 'title']

    def __str__(self):
        return self.title
