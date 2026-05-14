from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Category, Course, Lesson, Video, Enrollment, LessonProgress
from .serializers import (
    CategorySerializer, CourseListSerializer, CourseDetailSerializer,
    LessonSerializer, VideoSerializer, EnrollmentSerializer, LessonProgressSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Course.objects.filter(is_published=True).select_related('teacher', 'category')
        if category := self.request.query_params.get('category'):
            qs = qs.filter(category__slug=category)
        if level := self.request.query_params.get('level'):
            qs = qs.filter(level=level)
        if search := self.request.query_params.get('search'):
            qs = qs.filter(title__icontains=search)
        return qs


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_published=True).prefetch_related(
        'topics__lessons__videos'
    )
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.AllowAny]


class LessonDetailView(generics.RetrieveAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lesson.objects.prefetch_related('videos')

    def get(self, request, *args, **kwargs):
        lesson = self.get_object()
        course = lesson.topic.course
        # Bepul preview yoki yozilgan bo'lsa ko'rish mumkin
        if not lesson.is_free_preview:
            if not Enrollment.objects.filter(student=request.user, course=course).exists():
                return Response(
                    {'detail': "Bu darsni ko'rish uchun kursga yoziling."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        return super().get(request, *args, **kwargs)


class VideoDetailView(generics.RetrieveAPIView):
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Video.objects.select_related('lesson__topic__course')

    def get(self, request, *args, **kwargs):
        video = self.get_object()
        course = video.lesson.topic.course
        if not video.lesson.is_free_preview:
            if not Enrollment.objects.filter(student=request.user, course=course).exists():
                return Response(
                    {'detail': "Bu videoni ko'rish uchun kursga yoziling."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        return super().get(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def enroll(request, pk):
    course = generics.get_object_or_404(Course, pk=pk, is_published=True)
    enrollment, created = Enrollment.objects.get_or_create(student=request.user, course=course)
    serializer = EnrollmentSerializer(enrollment)
    code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
    return Response(serializer.data, status=code)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_lesson_done(request, pk):
    lesson = generics.get_object_or_404(Lesson, pk=pk)
    progress, _ = LessonProgress.objects.get_or_create(student=request.user, lesson=lesson)
    if not progress.completed:
        progress.completed = True
        progress.completed_at = timezone.now()
        progress.save(update_fields=['completed', 'completed_at'])
    # progress o'zgarsa kurs foizini qayta hisoblash
    try:
        enrollment = Enrollment.objects.get(student=request.user, course=lesson.topic.course)
        enrollment.recalculate_progress()
    except Enrollment.DoesNotExist:
        pass
    return Response(LessonProgressSerializer(progress).data)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_watch_time(request, pk):
    """Video ko'rilgan vaqtni yangilash (5 sekundda bir marta chaqiriladi)."""
    lesson = generics.get_object_or_404(Lesson, pk=pk)
    seconds = request.data.get('watch_seconds', 0)
    progress, _ = LessonProgress.objects.get_or_create(student=request.user, lesson=lesson)
    if isinstance(seconds, int) and seconds > progress.watch_seconds:
        progress.watch_seconds = seconds
        progress.save(update_fields=['watch_seconds'])
    return Response(LessonProgressSerializer(progress).data)


class MyEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(
            student=self.request.user
        ).select_related('course__teacher', 'course__category')
