from django.urls import path
from . import api_views

urlpatterns = [
    path('categories/',              api_views.CategoryListView.as_view(),  name='api-categories'),
    path('',                         api_views.CourseListView.as_view(),     name='api-courses'),
    path('<int:pk>/',                api_views.CourseDetailView.as_view(),   name='api-course-detail'),
    path('<int:pk>/enroll/',         api_views.enroll,                       name='api-enroll'),
    path('lesson/<int:pk>/',         api_views.LessonDetailView.as_view(),   name='api-lesson'),
    path('lesson/<int:pk>/done/',    api_views.mark_lesson_done,             name='api-lesson-done'),
    path('lesson/<int:pk>/watch/',   api_views.update_watch_time,            name='api-watch-time'),
    path('video/<int:pk>/',          api_views.VideoDetailView.as_view(),    name='api-video'),
    path('my/',                      api_views.MyEnrollmentsView.as_view(),  name='api-my-courses'),
]
