from django.shortcuts import render
from django.shortcuts import redirect
import urllib.parse as urlparse
from urllib.parse import parse_qs


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