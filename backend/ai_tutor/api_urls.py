from django.urls import path
from . import api_views

urlpatterns = [
    path('', api_views.ConversationListView.as_view(), name='api-conversations'),
    path('<int:pk>/', api_views.ConversationDetailView.as_view(), name='api-conversation-detail'),
    path('<int:pk>/send/', api_views.send_message, name='api-send-message'),
]
