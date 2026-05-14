from django.urls import path
from . import views

app_name = 'tests'

urlpatterns = [
    path('<int:pk>/', views.quiz_detail, name='quiz'),
    path('<int:pk>/submit/', views.quiz_submit, name='submit'),
    path('result/<int:pk>/', views.quiz_result, name='result'),
]
