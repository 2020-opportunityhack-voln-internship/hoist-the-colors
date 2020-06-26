from django.urls import path
from . import views


urlpatterns = [
    path('', views.login, name='login'),
    path('home/', views.home, name='home'),
    path('facebook/auth', views.facebook_auth, name='facebook_auth'),
    path('facebook/redirect', views.facebook_access_token, name='facebook_access_token'),
    path('facebook/data', views.facebook_data, name='facebook_data'),
    path('twitter/auth', views.twitter_auth, name='twitter_auth'),
    path('twitter/callback', views.twitter_access_token, name='twitter_access_token'),
    path('twitter/data', views.twitter_data, name='twitter_data'),
]