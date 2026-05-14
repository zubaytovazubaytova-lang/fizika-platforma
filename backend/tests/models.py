from django.db import models
from django.conf import settings
from courses.models import Course, Lesson


class Quiz(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='quizzes', null=True, blank=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    time_limit_minutes = models.PositiveIntegerField(default=0, help_text="0 = cheklovsiz")
    pass_score = models.PositiveSmallIntegerField(default=60, help_text="O'tish uchun minimal ball (%)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Test'
        verbose_name_plural = 'Testlar'

    def __str__(self):
        return self.title

    @property
    def question_count(self):
        return self.questions.count()


class Question(models.Model):
    class QuestionType(models.TextChoices):
        SINGLE = 'single', 'Bitta javob'
        MULTIPLE = 'multiple', 'Ko\'p javob'

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=10, choices=QuestionType.choices, default=QuestionType.SINGLE)
    points = models.PositiveSmallIntegerField(default=1)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Savol'
        verbose_name_plural = 'Savollar'
        ordering = ['order']

    def __str__(self):
        return f"{self.quiz.title}: {self.text[:60]}"


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Javob varianti'
        verbose_name_plural = 'Javob variantlari'

    def __str__(self):
        mark = '✓' if self.is_correct else '✗'
        return f"[{mark}] {self.text[:60]}"


class QuizAttempt(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    score = models.PositiveSmallIntegerField(default=0, help_text="Ball foizda")
    is_passed = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Test urinishi'
        verbose_name_plural = 'Test urinishlari'
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.student.username} — {self.quiz.title} ({self.score}%)"

    def calculate_score(self):
        total_points = sum(q.points for q in self.quiz.questions.all())
        if total_points == 0:
            return 0
        earned = 0
        for answer in self.answers.all():
            correct_ids = set(answer.question.choices.filter(is_correct=True).values_list('id', flat=True))
            chosen_ids = set(answer.chosen_choices.values_list('id', flat=True))
            if correct_ids == chosen_ids:
                earned += answer.question.points
        return round(earned / total_points * 100)


class UserAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    chosen_choices = models.ManyToManyField(Choice, blank=True)

    class Meta:
        unique_together = ('attempt', 'question')

    def __str__(self):
        return f"{self.attempt} — {self.question.text[:40]}"
