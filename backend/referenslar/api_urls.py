from django.urls import path
from . import api_views

urlpatterns = [
    path('formulalar/',  api_views.FormulaListView.as_view(),      name='api-formulalar'),
    path('kattaliklar/', api_views.FizikKattaikListView.as_view(), name='api-kattaliklar'),
    path('birliklar/',   api_views.FizikBirlikListView.as_view(),  name='api-birliklar'),
]
