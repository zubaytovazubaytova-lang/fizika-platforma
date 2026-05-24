from rest_framework import serializers
from .models import Category, Course, Topic, Lesson, Video, Slide, Enrollment, LessonProgress
from users.serializers import UserPublicSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')


class VideoSerializer(serializers.ModelSerializer):
    embed_url        = serializers.ReadOnlyField()
    duration_display = serializers.ReadOnlyField()

    class Meta:
        model = Video
        fields = (
            'id', 'title', 'source', 'video_url', 'embed_url',
            'video_id', 'thumbnail', 'duration_seconds', 'duration_display',
            'order', 'transcript',
        )


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Slide
        fields = ('id', 'title', 'content', 'image', 'order')


class LessonSerializer(serializers.ModelSerializer):
    videos           = VideoSerializer(many=True, read_only=True)
    slides           = SlideSerializer(many=True, read_only=True)
    has_video        = serializers.ReadOnlyField()
    total_duration_seconds = serializers.ReadOnlyField()

    class Meta:
        model = Lesson
        fields = (
            'id', 'title', 'content', 'lesson_type',
            'order', 'is_free_preview',
            'has_video', 'total_duration_seconds',
            'videos', 'slides', 'created_at',
        )


class LessonListSerializer(serializers.ModelSerializer):
    """Ro'yxat uchun — content va video tafsilotlarsiz."""
    has_video        = serializers.ReadOnlyField()
    total_duration_seconds = serializers.ReadOnlyField()

    class Meta:
        model = Lesson
        fields = (
            'id', 'title', 'lesson_type', 'order',
            'is_free_preview', 'has_video', 'total_duration_seconds',
        )


class TopicSerializer(serializers.ModelSerializer):
    lessons      = LessonListSerializer(many=True, read_only=True)
    lesson_count = serializers.ReadOnlyField()

    class Meta:
        model = Topic
        fields = ('id', 'title', 'description', 'order', 'lesson_count', 'lessons')


class CourseListSerializer(serializers.ModelSerializer):
    teacher              = UserPublicSerializer(read_only=True)
    category             = CategorySerializer(read_only=True)
    topic_count          = serializers.ReadOnlyField()
    lesson_count         = serializers.ReadOnlyField()
    video_count          = serializers.ReadOnlyField()
    total_duration_minutes = serializers.ReadOnlyField()

    class Meta:
        model = Course
        fields = (
            'id', 'title', 'slug', 'description',
            'teacher', 'category', 'level', 'thumbnail',
            'topic_count', 'lesson_count', 'video_count',
            'total_duration_minutes', 'is_free', 'created_at',
        )


class CourseDetailSerializer(serializers.ModelSerializer):
    teacher              = UserPublicSerializer(read_only=True)
    category             = CategorySerializer(read_only=True)
    topics               = TopicSerializer(many=True, read_only=True)
    topic_count          = serializers.ReadOnlyField()
    lesson_count         = serializers.ReadOnlyField()
    video_count          = serializers.ReadOnlyField()
    total_duration_minutes = serializers.ReadOnlyField()
    is_enrolled          = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = (
            'id', 'title', 'slug', 'description',
            'teacher', 'category', 'level', 'thumbnail',
            'topics', 'topic_count', 'lesson_count', 'video_count',
            'total_duration_minutes', 'is_free', 'is_enrolled', 'created_at',
        )

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(student=request.user, course=obj).exists()
        return False


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ('id', 'course', 'progress_percent', 'enrolled_at')


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ('id', 'lesson', 'completed', 'completed_at', 'watch_seconds')
