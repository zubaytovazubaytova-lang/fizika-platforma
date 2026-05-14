from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Quiz, Question, Choice, QuizAttempt, UserAnswer
from .serializers import QuizListSerializer, QuizDetailSerializer, QuizAttemptSerializer, QuizSubmitSerializer


class QuizListView(generics.ListAPIView):
    serializer_class = QuizListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Quiz.objects.all()
        course_id = self.request.query_params.get('course')
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs


class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def quiz_submit(request, pk):
    quiz = generics.get_object_or_404(Quiz, pk=pk)
    serializer = QuizSubmitSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    attempt = QuizAttempt.objects.create(student=request.user, quiz=quiz)

    for ans_data in serializer.validated_data['answers']:
        question = generics.get_object_or_404(Question, pk=ans_data['question_id'], quiz=quiz)
        user_answer = UserAnswer.objects.create(attempt=attempt, question=question)
        choices = question.choices.filter(pk__in=ans_data['choice_ids'])
        user_answer.chosen_choices.set(choices)

    score = attempt.calculate_score()
    attempt.score = score
    attempt.is_passed = score >= quiz.pass_score
    attempt.completed_at = timezone.now()
    attempt.save()

    return Response(QuizAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class MyAttemptsView(generics.ListAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(student=self.request.user).select_related('quiz')


class AttemptDetailView(generics.RetrieveAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(student=self.request.user)
