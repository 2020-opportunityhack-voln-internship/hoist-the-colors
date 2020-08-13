from django.shortcuts import render
from django.shortcuts import redirect
from tweepy import OAuthHandler, API, Cursor
import json
from django.http import HttpResponse
from scoring.views import preprocess
from pymongo import MongoClient
from threading import Thread
from authentication.views.encrypt_access import *


# Create your views here.
if not load_key():
    write_key()

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
    key = load_key()
    request_token = request.session['request_token']
    del request.session['request_token']

    oauth = OAuthHandler(consumer_key, consumer_secret, callback)
    oauth.request_token = request_token
    verifier = request.GET.get('oauth_verifier')
    oauth.get_access_token(verifier)

    # Create access_token dictonary
    access_tokens = { 'access_token': oauth.access_token, 'access_token_secret': oauth.access_token_secret }
    # Encrypt the dictonary
    encrypted_access_token = encrypt(json.dumps(access_tokens).encode('utf-8'), key)
    
    # Connect to MongoDB
    try:
        conn = MongoClient()
        print("Connected successfully!!!")
        db = conn.database

        # Created or Switched to collection names: tokens
        collection = db.tokens
        # Store encrypted access_token
        collection.insert_one({'access_token': encrypted_access_token})

        # Close connection
        conn.close()
    except:
        print("Could not connect to MongoDB")
    
    return redirect('twitter_data')


# gets data from user utilizing access token
def twitter_data(request):
    key = load_key()
    # Connect to MongoDB to retrive access_token
    try:
        conn = MongoClient()
        print("Connected successfully!!!")
        db = conn.database
        # Created or Switched to collection names: tokens
        collection = db.tokens
        cursor = collection.find()
        for record in cursor:
            access_token = json.loads(decrypt(record['access_token'], key).decode('utf-8'))
            token = access_token['access_token']
            token_secret = access_token['access_token_secret']
        conn.close()
    except:
        print("Could not connect to MongoDB")

    oauth = OAuthHandler(consumer_key, consumer_secret, callback)
    oauth.set_access_token(token, token_secret)
    api = API(oauth)
    statuses = []
    for status in Cursor(api.user_timeline).items():
        statuses.append(status.text)
    thread_preprocess_data = Thread(target=preprocess, args=(request, statuses))
    thread_preprocess_data.start()
    return render(request, "home.html", {'statuses': ["Thank you!"]})
    # return render(request, "login.html")
