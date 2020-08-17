# Create your views here.
from django.shortcuts import render
from django.shortcuts import redirect
from requests_oauthlib import OAuth2Session
from requests_oauthlib.compliance_fixes import facebook_compliance_fix
import os
import json


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
    request.session['facebook_access_token'] = dict(oauth.token)
    return render(request, "home.html", {'statuses': ["Thank you for login to facebook!"]})

