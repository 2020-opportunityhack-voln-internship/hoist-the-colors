from django.shortcuts import render,HttpResponse
from .models import User
from .serializers import UserSerializer, UserDataSerializer
from rest_framework import viewsets

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.values('id','name')
    serializer_class = UserSerializer
    # http_method_names = ['get']

class UserDataViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserDataSerializer
    # http_method_names = ['get']

def insert_data(request):
    # const
    # user_data = [
    #     {
    #         id: 1,
    #         name: "Animesh Mohan",
    #         risk_score: 10,
    #         category_avg: [
    #             {category_name: "toxic", score: 5},
    #             {category_name: "severe_toxic", score: 3},
    #             {category_name: "obscene", score: 2},
    #             {category_name: "threat", score: 6},
    #             {category_name: "insult", score: 7},
    #             {category_name: "identity_hate", score: 6},
    #         ],
    #         time: [
    #             {year: 2015, score: 3},
    #             {year: 2016, score: 5},
    #             {year: 2017, score: 6},
    #             {year: 2018, score: 9},
    #             {year: 2019, score: 10},
    #             {year: 2020, score: 8},
    #         ],
    #     },
    #     {
    #         id: 2,
    #         name: "Karishma Joseph",
    #         risk_score: 1,
    #         category_avg: [
    #             {category_name: "toxic", score: 1},
    #             {category_name: "severe_toxic", score: 2},
    #             {category_name: "obscene", score: 3},
    #             {category_name: "threat", score: 2},
    #             {category_name: "insult", score: 5},
    #             {category_name: "identity_hate", score: 1},
    #         ],
    #         time: [
    #             {year: 2015, score: 4},
    #             {year: 2016, score: 2},
    #             {year: 2017, score: 3},
    #             {year: 2018, score: 1},
    #             {year: 2019, score: 1},
    #             {year: 2020, score: 0},
    #         ],
    #     },
    # ];
    User.objects.create(name='Jimmy Hendrix', risk_score=4, category_avg=[{ 'category_name': "toxic", 'score': 3 },{ 'category_name': "severe_toxic", 'score': 5 },{ 'category_name': "obscene", 'score': 4 },{ 'category_name': "threat", 'score': 3 },{ 'category_name': "insult", 'score': 2 },{ 'category_name': "identity_hate", 'score': 4 },],risk_run=[{'year': 2015, 'score': 1}, {'year':2016,'score':5},{'year':2017,'score':4},{'year':2018,'score':5}, {'year':2019,'score':6}, {'year':2020,'score':3}])
    return HttpResponse(content=bytes("data entered",encoding="UTF-8"))

# Create your views here.
