from rest_framework import serializers
from .models import Quiz, Question, Choice, QuizAttempt, UserAnswer


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'text')


class ChoiceWithAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'text', 'is_correct')


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'question_type', 'points', 'order', 'choices')


class QuizListSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Quiz
        fields = ('id', 'title', 'description', 'time_limit_minutes', 'pass_score', 'question_count')


class QuizDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Quiz
        fields = ('id', 'title', 'description', 'time_limit_minutes', 'pass_score',
                  'question_count', 'questions')


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_ids = serializers.ListField(child=serializers.IntegerField())


class QuizSubmitSerializer(serializers.Serializer):
    answers = SubmitAnswerSerializer(many=True)


class UserAnswerResultSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.text')
    chosen_choices = ChoiceWithAnswerSerializer(many=True)
    correct_choices = serializers.SerializerMethodField()

    class Meta:
        model = UserAnswer
        fields = ('question_text', 'chosen_choices', 'correct_choices')

    def get_correct_choices(self, obj):
        return ChoiceWithAnswerSerializer(
            obj.question.choices.filter(is_correct=True), many=True
        ).data


class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = UserAnswerResultSerializer(many=True, read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ('id', 'quiz', 'score', 'is_passed', 'started_at', 'completed_at', 'answers')
