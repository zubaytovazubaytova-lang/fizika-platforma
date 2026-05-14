from django.urls import path
from . import views

app_name = 'ai_tutor'

urlpatterns = [
    path('', views.conversation_list, name='list'),
    path('new/', views.new_conversation, name='new'),
    path('<int:pk>/', views.conversation_detail, name='chat'),
    path('<int:pk>/send/', views.send_message, name='send'),
]
