from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Course, Topic, Lesson, Video, Slide, Enrollment, LessonProgress


class TopicInline(admin.TabularInline):
    model = Topic
    extra = 1
    fields = ('title', 'order', 'description')
    ordering = ('order',)


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ('title', 'lesson_type', 'order', 'is_free_preview')
    ordering = ('order',)


class VideoInline(admin.TabularInline):
    model = Video
    extra = 1
    fields = ('title', 'source', 'video_url', 'duration_seconds', 'order')
    ordering = ('order',)


class SlideInline(admin.StackedInline):
    model   = Slide
    extra   = 1
    fields  = ('title', 'content', 'image', 'order')
    ordering = ('order',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'teacher', 'category', 'level',
        'topic_count', 'lesson_count', 'video_count',
        'total_duration_display', 'is_published', 'is_free',
    )
    list_filter = ('is_published', 'is_free', 'level', 'category')
    search_fields = ('title', 'teacher__username')
    list_editable = ('is_published', 'is_free')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [TopicInline]

    def total_duration_display(self, obj):
        mins = obj.total_duration_minutes
        if mins >= 60:
            return f"{mins // 60}s {mins % 60}d"
        return f"{mins} daqiqa"
    total_duration_display.short_description = 'Umumiy vaqt'


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'lesson_count')
    list_filter = ('course',)
    search_fields = ('title', 'course__title')
    ordering = ('course', 'order')
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'topic', 'lesson_type', 'order', 'is_free_preview', 'has_video', 'created_at')
    list_filter = ('lesson_type', 'is_free_preview', 'topic__course')
    search_fields = ('title', 'topic__title')
    ordering = ('topic__course', 'topic__order', 'order')
    inlines = [VideoInline, SlideInline]

    def has_video(self, obj):
        return obj.videos.exists()
    has_video.boolean = True
    has_video.short_description = 'Video'


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'source', 'duration_display', 'embed_preview', 'order', 'created_at')
    list_filter = ('source', 'lesson__topic__course')
    search_fields = ('title', 'lesson__title')
    ordering = ('lesson__topic__course', 'lesson__order', 'order')
    readonly_fields = ('video_id', 'embed_url', 'duration_display', 'embed_preview')

    def embed_preview(self, obj):
        if obj.embed_url:
            return format_html(
                '<a href="{}" target="_blank">▶ Ko\'rish</a>', obj.embed_url
            )
        return '—'
    embed_preview.short_description = 'Ko\'rish'


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'progress_percent', 'enrolled_at')
    list_filter = ('course',)
    search_fields = ('student__username', 'course__title')
    readonly_fields = ('enrolled_at',)


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ('student', 'lesson', 'watch_seconds_display', 'completed', 'completed_at')
    list_filter = ('completed', 'lesson__topic__course')
    search_fields = ('student__username', 'lesson__title')

    def watch_seconds_display(self, obj):
        m, s = divmod(obj.watch_seconds, 60)
        return f"{m}:{s:02d}"
    watch_seconds_display.short_description = 'Ko\'rilgan vaqt'
