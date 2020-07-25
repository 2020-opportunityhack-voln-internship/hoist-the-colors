# Create your views here.
from django.shortcuts import render
from django.shortcuts import redirect
from requests_oauthlib import OAuth2Session
from requests_oauthlib.compliance_fixes import facebook_compliance_fix
import os
import json
from pymongo import MongoClient
from threading import Thread
from scoring.views import preprocess



os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Json file that contains the user credentials to access Facebook API
with open('authentication/credentials.json') as f:
    credentials = json.load(f)

client_id = credentials['facebook_client_id']
client_secret = credentials['facebook_client_secret']

# OAuth endpoints given in the Facebook API documentation
authorization_base_url = 'https://www.facebook.com/v7.0/dialog/oauth'
token_url = 'https://graph.facebook.com/oauth/access_token'
redirect_uri = 'http://localhost:8000/authentication/facebook/redirect'  # Should match Site URL


# redirects to authorization url
def facebook_auth(request):
    oauth = OAuth2Session(client_id, redirect_uri=redirect_uri, scope='user_posts')
    oauth = facebook_compliance_fix(oauth)
    authorization_url, state = oauth.authorization_url(authorization_base_url)
    return redirect(authorization_url)


# fetches access token from user after authorization
def facebook_access_token(request):
    redirect_response = request.get_full_path()
    oauth = OAuth2Session(client_id, redirect_uri=redirect_uri)
    oauth.fetch_token(token_url, client_secret=client_secret, authorization_response=redirect_response)

    # Connect to MongoDB
    try:
        conn = MongoClient()
        print("Connected successfully!!!")
        db = conn.database

        # Created or Switched to collection names: tokens
        collection = db.fb_token
        collection.insert_one(dict(oauth.token))
        # Close connection
        conn.close()
    except:
        print("Could not connect to MongoDB")
    return redirect('facebook_data')


# gets data from user utilizing access token
def facebook_data(request):
    try:
        conn = MongoClient()
        print("Connected successfully!!!")
        db = conn.database
        # Created or Switched to collection names: tokens
        collection = db.fb_token
        cursor = collection.find()
        for record in cursor:
            token = record
        conn.close()
    except:
        print("Could not connect to MongoDB")
    oauth = OAuth2Session(client_id, token=token)
    user_posts = oauth.get('https://graph.facebook.com/me/posts')
    user_posts_json = json.loads(user_posts.content.decode('utf-8'))['data']
    posts = []
    for i, x in enumerate(user_posts_json):
        if i > 3:
            break
        if 'message' in x:
            posts.append(x['message'])
    thread_preprocess_data = Thread(target=preprocess, args=(request, posts))
    thread_preprocess_data.start()
    return render(request, "home.html", {'statuses': posts})