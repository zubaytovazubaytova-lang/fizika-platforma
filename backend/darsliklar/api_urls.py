from django.urls import path
from .api_views import DarslikListCreateView, DarslikDetailView

urlpatterns = [
    path('',      DarslikListCreateView.as_view(), name='darslik-list'),
    path('<int:pk>/', DarslikDetailView.as_view(),  name='darslik-detail'),
]
