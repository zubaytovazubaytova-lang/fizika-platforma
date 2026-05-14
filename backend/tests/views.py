from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib import messages
from .models import Quiz, QuizAttempt, UserAnswer


@login_required
def quiz_detail(request, pk):
    quiz = get_object_or_404(Quiz, pk=pk)
    questions = quiz.questions.prefetch_related('choices')
    return render(request, 'tests/quiz.html', {'quiz': quiz, 'questions': questions})


@login_required
def quiz_submit(request, pk):
    quiz = get_object_or_404(Quiz, pk=pk)
    if request.method != 'POST':
        return redirect('tests:quiz', pk=pk)

    attempt = QuizAttempt.objects.create(student=request.user, quiz=quiz)

    for question in quiz.questions.prefetch_related('choices'):
        answer = UserAnswer.objects.create(attempt=attempt, question=question)
        chosen_ids = request.POST.getlist(f'question_{question.pk}')
        if chosen_ids:
            answer.chosen_choices.set(question.choices.filter(pk__in=chosen_ids))

    score = attempt.calculate_score()
    attempt.score = score
    attempt.is_passed = score >= quiz.pass_score
    attempt.completed_at = timezone.now()
    attempt.save()

    return redirect('tests:result', pk=attempt.pk)


@login_required
def quiz_result(request, pk):
    attempt = get_object_or_404(QuizAttempt, pk=pk, student=request.user)
    answers = attempt.answers.select_related('question').prefetch_related('chosen_choices', 'question__choices')
    return render(request, 'tests/result.html', {'attempt': attempt, 'answers': answers})
