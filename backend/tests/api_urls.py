from django.urls import path
from . import api_views

urlpatterns = [
    path('', api_views.QuizListView.as_view(), name='api-quizzes'),
    path('<int:pk>/', api_views.QuizDetailView.as_view(), name='api-quiz-detail'),
    path('<int:pk>/submit/', api_views.quiz_submit, name='api-quiz-submit'),
    path('attempts/', api_views.MyAttemptsView.as_view(), name='api-my-attempts'),
    path('attempts/<int:pk>/', api_views.AttemptDetailView.as_view(), name='api-attempt-detail'),
]
