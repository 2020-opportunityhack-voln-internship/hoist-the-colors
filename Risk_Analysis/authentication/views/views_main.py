from django.shortcuts import render
from django.shortcuts import redirect
import urllib.parse as urlparse
from urllib.parse import parse_qs
from pymongo import MongoClient
from authentication.views.encrypt_access import *
import json
from threading import Thread
from scoring.views import fetch_access_tokens


# Create your views here.
if not load_key():
    write_key()



def login(request):
    return render(request, 'login.html')

def home(request):
    url = request.get_full_path()
    parsed = urlparse.urlparse(url)
    app = parse_qs(parsed.query)['app']
    if app == ['Twitter']:
        return redirect('twitter_auth')
    elif app == ['Facebook']:
        return redirect('facebook_auth')
    elif app == ['Submit']:
        store_token(request)
        return redirect('www.google.com')




def store_token(request):
    key = load_key()

    # Create access_token dictonary
    access_tokens = {'twitter_access_token': request.session.get('twitter_access_token'), 'twitter_access_token_secret': request.session.get('twitter_access_token_secret'),'facebook_access_token': request.session.get('facebook_access_token')}

    # Encrypt the dictonary
    encrypted_access_token = encrypt(json.dumps(access_tokens).encode('utf-8'), key)

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
    thread_preprocess_data = Thread(target=fetch_access_tokens)
    thread_preprocess_data.start()