from django.shortcuts import render
from django.shortcuts import redirect
from tweepy import OAuthHandler, API, Cursor
import json


# Json file that contains the user credentials to access Twitter API
with open('authentication/credentials.json') as f:
    credentials = json.load(f)

consumer_key = credentials['twitter_consumer_key']
consumer_secret = credentials['twitter_consumer_secret']

callback = 'http://127.0.0.1:8000/authentication/twitter/callback'


# redirects to authorization url
def twitter_auth(request):
    oauth = OAuthHandler(consumer_key, consumer_secret, callback)
    url = oauth.get_authorization_url()
    request.session['request_token'] = oauth.request_token
    return redirect(url)


# fetches access token from user after authorization
def twitter_access_token(request):
    request_token = request.session['request_token']
    del request.session['request_token']

    oauth = OAuthHandler(consumer_key, consumer_secret, callback)
    oauth.request_token = request_token
    verifier = request.GET.get('oauth_verifier')
    oauth.get_access_token(verifier)

    request.session['twitter_access_token'] = oauth.access_token
    request.session['twitter_access_token_secret'] = oauth.access_token_secret

    return render(request, "home.html", {'app_name': "Twitter"})


