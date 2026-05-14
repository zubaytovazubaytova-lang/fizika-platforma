from django.contrib import admin
from .models import Quiz, Question, Choice, QuizAttempt, UserAnswer


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 3
    show_change_link = True


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'lesson', 'question_count', 'pass_score', 'time_limit_minutes', 'created_at')
    list_filter = ('course',)
    search_fields = ('title',)
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'quiz', 'question_type', 'points', 'order')
    list_filter = ('quiz', 'question_type')
    inlines = [ChoiceInline]


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('student', 'quiz', 'score', 'is_passed', 'started_at', 'completed_at')
    list_filter = ('is_passed', 'quiz')
    search_fields = ('student__username', 'quiz__title')
    readonly_fields = ('score', 'is_passed', 'started_at', 'completed_at')
