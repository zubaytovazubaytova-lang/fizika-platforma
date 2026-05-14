from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = 'Kategoriya'
        verbose_name_plural = 'Kategoriyalar'

    def __str__(self):
        return self.name


class Course(models.Model):
    class Level(models.TextChoices):
        BEGINNER     = 'beginner',     'Boshlang\'ich'
        INTERMEDIATE = 'intermediate', 'O\'rta'
        ADVANCED     = 'advanced',     'Yuqori'

    title        = models.CharField(max_length=200)
    slug         = models.SlugField(unique=True, blank=True)
    description  = models.TextField()
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')
    teacher      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='taught_courses')
    thumbnail    = models.ImageField(upload_to='courses/thumbnails/', blank=True, null=True)
    level        = models.CharField(max_length=15, choices=Level.choices, default=Level.BEGINNER)
    is_published = models.BooleanField(default=False)
    is_free      = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Kurs'
        verbose_name_plural = 'Kurslar'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def topic_count(self):
        return self.topics.count()

    @property
    def lesson_count(self):
        return Lesson.objects.filter(topic__course=self).count()

    @property
    def video_count(self):
        return Video.objects.filter(lesson__topic__course=self).count()

    @property
    def total_duration_minutes(self):
        from django.db.models import Sum
        result = Video.objects.filter(
            lesson__topic__course=self
        ).aggregate(total=Sum('duration_seconds'))
        seconds = result['total'] or 0
        return round(seconds / 60)


class Topic(models.Model):
    """Mavzu — kurs ichidagi bo'lim (masalan: Mexanika, Termodinamika)"""
    course      = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='topics')
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order       = models.PositiveIntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Mavzu'
        verbose_name_plural = 'Mavzular'
        ordering = ['order']
        unique_together = ('course', 'order')

    def __str__(self):
        return f"{self.course.title} › {self.title}"

    @property
    def lesson_count(self):
        return self.lessons.count()


class Lesson(models.Model):
    """Dars — mavzu ichidagi bitta dars (matn + video)"""
    class LessonType(models.TextChoices):
        TEXT  = 'text',  'Matn darsi'
        VIDEO = 'video', 'Video dars'
        MIXED = 'mixed', 'Aralash (matn + video)'

    topic           = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='lessons')
    title           = models.CharField(max_length=200)
    content         = models.TextField(blank=True, help_text='Matn, formula va tushuntirish (Markdown)')
    lesson_type     = models.CharField(max_length=10, choices=LessonType.choices, default=LessonType.MIXED)
    order           = models.PositiveIntegerField(default=0)
    is_free_preview = models.BooleanField(default=False, help_text='Ro\'yxatdan o\'tmasdan ko\'rish mumkin')
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Dars'
        verbose_name_plural = 'Darslar'
        ordering = ['order']
        unique_together = ('topic', 'order')

    def __str__(self):
        return f"{self.topic.title} › {self.title}"

    @property
    def total_duration_seconds(self):
        return sum(v.duration_seconds for v in self.videos.all())

    @property
    def has_video(self):
        return self.videos.exists()


class Video(models.Model):
    """Video dars — dars ichidagi video (YouTube, Vimeo yoki upload)"""
    class VideoSource(models.TextChoices):
        YOUTUBE = 'youtube', 'YouTube'
        VIMEO   = 'vimeo',   'Vimeo'
        UPLOAD  = 'upload',  'Yuklangan fayl'
        OTHER   = 'other',   'Boshqa'

    lesson           = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='videos')
    title            = models.CharField(max_length=200)
    source           = models.CharField(max_length=10, choices=VideoSource.choices, default=VideoSource.YOUTUBE)
    video_url        = models.URLField(help_text='YouTube/Vimeo havolasi yoki fayl URL')
    video_id         = models.CharField(max_length=100, blank=True, help_text='YouTube/Vimeo video ID')
    thumbnail        = models.ImageField(upload_to='videos/thumbnails/', blank=True, null=True)
    duration_seconds = models.PositiveIntegerField(default=0)
    order            = models.PositiveIntegerField(default=0)
    transcript       = models.TextField(blank=True, help_text='Video matni (accessibility uchun)')
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Video dars'
        verbose_name_plural = 'Video darslar'
        ordering = ['order']

    def __str__(self):
        return f"{self.lesson.title} › {self.title}"

    def save(self, *args, **kwargs):
        if self.video_url and not self.video_id:
            self.video_id = self._extract_video_id(self.video_url)
        super().save(*args, **kwargs)

    @staticmethod
    def _extract_video_id(url: str) -> str:
        """YouTube va Vimeo URLdan video ID ni olish."""
        import re
        yt = re.search(r'(?:v=|youtu\.be/)([A-Za-z0-9_-]{11})', url)
        if yt:
            return yt.group(1)
        vm = re.search(r'vimeo\.com/(\d+)', url)
        if vm:
            return vm.group(1)
        return ''

    @property
    def embed_url(self) -> str:
        if self.source == self.VideoSource.YOUTUBE and self.video_id:
            return f'https://www.youtube.com/embed/{self.video_id}'
        if self.source == self.VideoSource.VIMEO and self.video_id:
            return f'https://player.vimeo.com/video/{self.video_id}'
        return self.video_url

    @property
    def duration_display(self) -> str:
        m, s = divmod(self.duration_seconds, 60)
        h, m = divmod(m, 60)
        if h:
            return f'{h}:{m:02d}:{s:02d}'
        return f'{m}:{s:02d}'


class Enrollment(models.Model):
    student          = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course           = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at      = models.DateTimeField(auto_now_add=True)
    progress_percent = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name = 'Ro\'yxatdan o\'tish'
        verbose_name_plural = 'Ro\'yxatdan o\'tishlar'
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.username} → {self.course.title}"

    def recalculate_progress(self):
        total = Lesson.objects.filter(topic__course=self.course).count()
        if total == 0:
            return
        done = LessonProgress.objects.filter(
            student=self.student,
            lesson__topic__course=self.course,
            completed=True,
        ).count()
        self.progress_percent = round(done / total * 100)
        self.save(update_fields=['progress_percent'])


class LessonProgress(models.Model):
    student      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson       = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress_records')
    completed    = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    watch_seconds = models.PositiveIntegerField(default=0, help_text='Ko\'rilgan vaqt (sekundda)')

    class Meta:
        verbose_name = 'Dars jarayoni'
        verbose_name_plural = 'Dars jarayonlari'
        unique_together = ('student', 'lesson')

    def __str__(self):
        status = 'bajarildi' if self.completed else 'jarayonda'
        return f"{self.student.username} — {self.lesson.title} ({status})"
