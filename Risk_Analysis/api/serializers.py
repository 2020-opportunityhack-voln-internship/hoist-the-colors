from rest_framework import serializers
from .models import User, categories_average, Time

class categories_avg_serializer(serializers.ListField):
    category_name = serializers.CharField()
    score = serializers.IntegerField()

class TimeSerializer(serializers.ListField):
    year = serializers.IntegerField()
    score = serializers.IntegerField()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name']

class UserDataSerializer(serializers.HyperlinkedModelSerializer):

    category_avg = categories_avg_serializer(categories_average)
    risk_run = TimeSerializer(Time)

    class Meta:
        model = User
        fields = ['id','name', 'risk_score', 'category_avg', 'risk_run']