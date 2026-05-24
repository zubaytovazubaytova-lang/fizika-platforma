from django.urls import path
from . import api_views

urlpatterns = [
    # Ro'yxatdan o'tish
    path('register/',        api_views.RegisterView.as_view(),         name='api-register'),

    # Kirish / chiqish
    path('login/',           api_views.LoginView.as_view(),            name='api-login'),
    path('logout/',          api_views.LogoutView.as_view(),           name='api-logout'),
    path('send-code/',        api_views.SendCodeView.as_view(),         name='api-send-code'),
    path('verify-code/',      api_views.VerifyCodeView.as_view(),       name='api-verify-code'),
    path('send-email-code/',  api_views.SendEmailCodeView.as_view(),    name='api-send-email-code'),
    path('verify-email-code/', api_views.VerifyEmailCodeView.as_view(), name='api-verify-email-code'),

    # Token
    path('token/refresh/',   api_views.TokenRefreshWithUserView.as_view(), name='api-token-refresh'),

    # Profil
    path('me/',              api_views.MeView.as_view(),               name='api-me'),

    # Parol
    path('change-password/', api_views.ChangePasswordView.as_view(),   name='api-change-password'),
]
