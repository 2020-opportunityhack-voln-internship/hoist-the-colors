from django.shortcuts import render
from django.shortcuts import redirect
from tweepy import OAuthHandler, API, Cursor
import json
from django.http import HttpResponse

# Create your views here.

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
    request.session['token'] = (oauth.access_token, oauth.access_token_secret)

    return redirect('twitter_data')


# gets data from user utilizing access token
def twitter_data(request):
    token, token_secret = request.session['token']
    oauth = OAuthHandler(consumer_key, consumer_secret, callback)
    oauth.set_access_token(token, token_secret)
    api = API(oauth)
    statuses = []
    for status in Cursor(api.user_timeline).items():
        statuses.append(status.text)
    return render(request, "home.html", {'statuses': statuses})
    # return render(request, "login.html")
