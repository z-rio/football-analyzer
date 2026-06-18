from django.urls import path
from . import views

app_name = 'football'

urlpatterns = [
    path('register/', views.CustomUserRegisterView.as_view(), name='register-user'),
    path('register/club/', views.ClubRegistrationView.as_view(), name='register-club'),
    path('teams/register/', views.TeamRegistrationView.as_view(), name='register-team'),
    path('users/<int:pk>/verify/', views.VerifyUserView.as_view(), name='verify-user'),
]