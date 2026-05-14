from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    path('', views.course_list, name='list'),
    path('<int:pk>/', views.course_detail, name='detail'),
    path('<int:pk>/enroll/', views.enroll, name='enroll'),
    path('lesson/<int:pk>/', views.lesson_detail, name='lesson'),
    path('lesson/<int:pk>/done/', views.mark_lesson_done, name='lesson_done'),
]
