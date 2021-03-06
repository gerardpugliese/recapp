from rest_framework import serializers
from .models import Movie, Rating, MovieBackground, Mark, UserProfile, TopTen, AppWideImages
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs =  {'password': {'write_only': True, 'required': True}} 

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'image', 'most_recent_movie', 'most_recent_show', 'first_login')

class MarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mark
        fields = ('id', 'user', 'item_id', 'media_type', 'state', 'is_favorite', 'rating', 'review')

class AppWideImagesSerializer(serializers.ModelSerializer):
    class Meta: 
        model = AppWideImages
        fields = ('id', 'imdb_image', 'rotten_tomatoes_image')

class TopTenSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopTen
        fields = ('id', 'user', 'item_id', 'media_type', 'number', 'img_link', 'title')

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'title', 'description', 'state', 'image', 'num_of_ratings', 'avg_rating')

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'movie', 'stars', 'user')

class MovieBackgroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieBackground
        fields = ('id', 'movie_name', 'movie_id')

