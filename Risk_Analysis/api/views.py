from django.shortcuts import render
from .models import User
from .serializers import UserSerializer, UserDataSerializer
from rest_framework import viewsets

class UserViewSet(viewsets.ModelViewSet):
    e = User.objects.create(name='Animesh Mohan', risk_score=100, category_avg=[{ 'category_name': "toxic", 'score': 5 },{ 'category_name': "severe_toxic", 'score': 3 },{ 'category_name': "obscene", 'score': 2 },{ 'category_name': "threat", 'score': 6 },{ 'category_name': "insult", 'score': 7 },{ 'category_name': "identity_hate", 'score': 6 },],risk_run=[{'year':2021,'score':23},{'year':1990,'score':50},{'year':2000,'score':50}])
    queryset = User.objects.values('id','name')
    serializer_class = UserSerializer
    http_method_names = ['get']

class UserDataViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserDataSerializer
    http_method_names = ['get']


# Create your views here.
