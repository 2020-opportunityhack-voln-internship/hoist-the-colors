from django.shortcuts import render
# Create your views here.

def preprocess(request, statuses):
    print("inside scoring:", statuses)