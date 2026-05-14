from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Course, Lesson, Enrollment, LessonProgress


def course_list(request):
    courses = Course.objects.filter(is_published=True).select_related('teacher', 'category')
    return render(request, 'courses/list.html', {'courses': courses})


def course_detail(request, pk):
    course = get_object_or_404(Course, pk=pk, is_published=True)
    modules = course.modules.prefetch_related('lessons')
    is_enrolled = (
        request.user.is_authenticated
        and Enrollment.objects.filter(student=request.user, course=course).exists()
    )
    return render(request, 'courses/detail.html', {
        'course': course,
        'modules': modules,
        'is_enrolled': is_enrolled,
    })


@login_required
def enroll(request, pk):
    course = get_object_or_404(Course, pk=pk, is_published=True)
    Enrollment.objects.get_or_create(student=request.user, course=course)
    messages.success(request, f"'{course.title}' kursiga yozildingiz!")
    return redirect('courses:detail', pk=pk)


@login_required
def lesson_detail(request, pk):
    lesson = get_object_or_404(Lesson, pk=pk)
    course = lesson.module.course
    if not Enrollment.objects.filter(student=request.user, course=course).exists():
        messages.warning(request, "Bu darsni ko'rish uchun kursga yoziling.")
        return redirect('courses:detail', pk=course.pk)
    progress, _ = LessonProgress.objects.get_or_create(student=request.user, lesson=lesson)
    return render(request, 'courses/lesson.html', {'lesson': lesson, 'progress': progress})


@login_required
def mark_lesson_done(request, pk):
    from django.utils import timezone
    lesson = get_object_or_404(Lesson, pk=pk)
    progress, _ = LessonProgress.objects.get_or_create(student=request.user, lesson=lesson)
    if not progress.completed:
        progress.completed = True
        progress.completed_at = timezone.now()
        progress.save()
    return redirect('courses:lesson', pk=pk)
