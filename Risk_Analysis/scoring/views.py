from django.shortcuts import render
from pymongo import MongoClient
from authentication.views.encrypt_access import *
import json
from tweepy import OAuthHandler, API, Cursor
from requests_oauthlib import OAuth2Session
from scoring.calculate_scores import calculate_scores


# Create your views here.

def fetch_twitter_data(access_token, access_token_secret, scores):

    with open('authentication/credentials.json') as f:
        credentials = json.load(f)

    consumer_key = credentials['twitter_consumer_key']
    consumer_secret = credentials['twitter_consumer_secret']

    callback = 'http://127.0.0.1:8000/authentication/twitter/callback'
    oauth = OAuthHandler(consumer_key, consumer_secret, callback)
    oauth.set_access_token(access_token, access_token_secret)
    api = API(oauth)
    for status in Cursor(api.user_timeline).items():
        calculate_scores(status.text, scores)
    # preprocess(statuses)


def fetch_facebook_data(access_token, scores):

    # Json file that contains the user credentials to access Facebook API
    with open('authentication/credentials.json') as f:
        credentials = json.load(f)

    client_id = credentials['facebook_client_id']

    oauth = OAuth2Session(client_id, token=access_token)
    user_posts = oauth.get('https://graph.facebook.com/me/posts')
    user_posts_json = json.loads(user_posts.content.decode('utf-8'))['data']
    posts = []
    for i, x in enumerate(user_posts_json):
        if i > 3:
            break
        if 'message' in x:
            calculate_scores(x['message'], scores)
    # preprocess(posts)

def fetch_access_tokens():
    key = load_key()
    #initializing scores for new user
    scores = {"total": 0, "risk_score": None, "toxic": None, "severe_toxic": None, "obscene": None, "threat": None, "insult": None,
              "identity_hate": None, "years": None}
    # Connect to MongoDB to retrieve access_token
    # try:
    conn = MongoClient()
    print("Connected successfully!!!")
    db = conn.database
    # Created or Switched to collection names: tokens
    collection = db.tokens
    record = collection.find_one()
    collection.delete_one(record)
    access_tokens = json.loads(decrypt(record['access_token'], key).decode('utf-8'))
    if 'twitter_access_token' in access_tokens and access_tokens['twitter_access_token'] and access_tokens['twitter_access_token_secret']:
        fetch_twitter_data(access_tokens['twitter_access_token'], access_tokens['twitter_access_token_secret'], scores)
    if 'facebook_access_token' in access_tokens and access_tokens['facebook_access_token']:
        fetch_facebook_data(access_tokens['facebook_access_token'], scores)

    if scores["total"] != 0:
        scores["risk_score"] /= scores["total"]
        scores["toxic"] /= scores["total"]
        scores["severe_toxic"] /= scores["total"]
        scores["obscene"] /= scores["total"]
        scores["threat"] /= scores["total"]
        scores["insult"] /= scores["total"]
        scores["identity_hate"] /= scores["total"]
        print(scores)
    conn.close()
    # except Exception as e:
    #     print( e)