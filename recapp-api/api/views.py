from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Movie, Rating, MovieBackground, Mark, UserProfile, TopTen, AppWideImages
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import MovieSerializer, RatingSerializer, UserSerializer, MovieBackgroundSerializer, MarkSerializer, UserProfileSerializer, TopTenSerializer, AppWideImagesSerializer
from rest_framework.authentication import TokenAuthentication

class AppWideImagesViewSet(viewsets.ModelViewSet):
    queryset = AppWideImages.objects.all()
    serializer_class = AppWideImagesSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

    @action(detail=False, methods=['GET'])
    def get_rating_images(self, request, pk=None):
        images = AppWideImages.objects.get(id=1)
        print(images)
        serializer = AppWideImagesSerializer(images, many=False)
        response = {"rating_images": serializer.data}
        return Response(response, status=status.HTTP_200_OK)

class TopTenViewSet(viewsets.ModelViewSet):
    queryset = TopTen.objects.all()
    serializer_class = TopTenSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

    @action(detail=False, methods=['GET'])
    def get_top_ten(self, request, pk=None):
        user = request.user
        top_tens = TopTen.objects.filter(user=user)
        serializer = TopTenSerializer(top_tens, many=True)
        response = {"TopTens": serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def set_top_ten(self, request, pk=None):
        if 'item_id' in request.data:
            print(request.data)
            req_item_id = request.data['item_id']
            user = request.user
            req_media_type = request.data['media']
            req_number = request.data['number']
            req_img_link = request.data['img_link']
            req_title = request.data['title']
            top_ten = TopTen.objects.create(user=user, item_id=req_item_id, media_type=req_media_type, number=req_number, img_link=req_img_link, title=req_title)
            serializer = TopTenSerializer(top_ten, many=False)
            response = {"Top Ten Created": serializer.data}
            return Response(response, status=status.HTTP_200_OK)


class MarkViewSet(viewsets.ModelViewSet):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)

    @action(detail=True, methods=['DELETE'])
    def remove_state(self, request, pk=None):
        user = request.user
        mark = Mark.objects.get(user=user, item_id=pk)
        mark.state = 0
        mark.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['GET'])
    def remove_favorite(self, request, pk=None):
        user = request.user
        mark = Mark.objects.get(user=user, item_id=pk)
        mark.state = 2
        mark.is_favorite = False
        mark.save()
        serializer = MarkSerializer(mark, many=False)
        response = {'Favorite Removed': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'])
    def get_movie_state(self, request, pk=None):
        user = request.user
        mark = Mark.objects.get(user=user, item_id=pk)
        serializer = MarkSerializer(mark, many=False)
        response = {'movie_state': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def mark_interested(self, request, pk=None):
        if 'movie_id' in request.data:
            req_movie_id = request.data['movie_id']
            user = request.user
            try: 
                mark = Mark.objects.get(user=user, item_id=req_movie_id)
                mark.state = 1
                mark.save()
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Updated.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)    
            except: 
                mark = Mark.objects.create(user=user, item_id=req_movie_id, media_type="movie", state=1, is_favorite=False)
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Created.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
        elif 'show_id' in request.data:
            req_show_id = request.data['show_id']
            user = request.user
            try: 
                mark = Mark.objects.get(user=user, item_id=req_show_id)
                mark.state = 1
                mark.save()
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Updated.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)    
            except: 
                mark = Mark.objects.create(user=user, item_id=req_show_id, media_type="tv", state=1, is_favorite=False)
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Created.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
        else:
            print(request.data)
            response = {'message': 'You need to provide a movie.'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def mark_watched(self, request, pk=None):
        if 'movie_id' in request.data:
            print(request.data)
            req_movie_id = request.data['movie_id']
            req_rating = request.data['rating']
            req_review = request.data['review']
            user = request.user
            user_profile = UserProfile.objects.get(user=user)
            try: 
                mark = Mark.objects.get(user=user, item_id=req_movie_id)
                mark.state = 2
                mark.rating = req_rating
                mark.review = req_review
                mark.save()
                user_profile.most_recent_movie  = req_movie_id
                user_profile.save()
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Updated.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)    
            except: 
                mark = Mark.objects.create(user=user, item_id=req_movie_id, media_type="movie", state=2, is_favorite=False, rating=req_rating, review=req_review)
                user_profile.most_recent_movie = req_movie_id
                user_profile.save()
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Created.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
        elif 'show_id' in request.data:
            req_show_id = request.data['show_id']
            req_rating = request.data['rating']
            req_review = request.data['review']
            user = request.user
            user_profile = UserProfile.objects.get(user=user)
            try: 
                mark = Mark.objects.get(user=user, item_id=req_show_id)
                mark.state = 2
                mark.rating = req_rating
                mark.save()
                user_profile.most_recent_show  = req_show_id
                print(user_profile.most_recent_movie)
                user_profile.save()
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Updated.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)    
            except: 
                mark = Mark.objects.create(user=user, item_id=req_show_id, media_type="tv", state=2, is_favorite=False, rating=req_rating)
                user_profile.most_recent_movie = req_movie_id
                print(user_profile.most_recent_movie)
                user_profile.save()
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Created.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'You need to provide a state.'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        
    
    @action(detail=True, methods=['POST'])
    def favorite_movie(self, request, pk=None):
        if 'movie_id' in request.data:
            req_is_favorite = pk
            req_movie_id = request.data['movie_id']
            user = request.user
            try:
                mark = Mark.objects.get(user=user, item_id=req_movie_id)
                mark.state = 2
                mark.is_favorite = pk
                mark.save()
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Updated.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
            except: 
                print("here2")
                mark = Mark.objects.create(user=user, item_id=req_movie_id, media_type="movie",state=2, is_favorite=True)
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Created.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
        elif 'show_id' in request.data:
            req_is_favorite = pk
            req_show_id = request.data['show_id']
            user = request.user
            try:
                mark = Mark.objects.get(user=user, item_id=req_show_id)
                mark.state = 2
                mark.is_favorite = pk
                mark.save()
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Updated.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
            except: 
                print("here2")
                mark = Mark.objects.create(user=user, item_id=req_show_id, media_type="tv",state=2, is_favorite=True)
                serializer = MarkSerializer(mark, many=False)
                response = {'message': 'Mark Created.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'You need to provide a state.'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def get_interested_list(self, request, pk=None):
        user = request.user
        interested_list = Mark.objects.filter(user=user, state=1)
        serializer = MarkSerializer(interested_list, many=True)
        response = {'interested_list': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def get_watched_list(self, request, pk=None):
        user = request.user
        watched_list = Mark.objects.filter(user=user, state=2)
        serializer = MarkSerializer(watched_list, many=True)
        response = {'watched_list': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def get_favorites_list(self, request, pk=None):
        user = request.user
        watched_list = Mark.objects.filter(user=user, is_favorite=True)
        serializer = MarkSerializer(watched_list, many=True)
        response = {'favorites_list': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    #@action(detail=False, methods=['GET'])
    #def get_interested_movies(self, request, pk=None):

    def update(self, request, *args, **kwargs):
        response = {'message': 'You cant update a mark like that.'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'You cant create a mark like that.'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def get_user_profile(self, request, pk=None):
        #Get User and UserProfile
        user = request.user
        profile = UserProfile.objects.get(user=user)
        #Get lists of all movies and shows the user has watched
        watched_movies = Mark.objects.filter(user=user, state=2, media_type="movie")
        watched_shows = Mark.objects.filter(user=user, state=2, media_type="tv")
        profile.save()
        serializer = UserProfileSerializer(profile, many=False)
        response = {'user_profile': serializer.data}
        return Response(response, status=status.HTTP_200_OK)


    @action(detail=False, methods=['POST'])
    def set_top_ten_movies(self, request, pk=None):
        if 'top_ten' in request.data:
            user = request.user
            profile = UserProfile.objects.get(user=user)
            profile.top_ten_movies = request.data['top_ten']
            profile.save()
            serializer = UserProfileSerializer(profile, many=False)
            response = {'user_profile updated': serializer.data}

class MovieBackgroundViewSet(viewsets.ModelViewSet):
    queryset = MovieBackground.objects.all()
    serializer_class = MovieBackgroundSerializer

    @action(detail=False, methods=['GET'])
    def get_movie_background(self, request, pk=None): 
        #Get movie background 
        movie_bkgs = MovieBackground.objects.all()
        serializer = MovieBackgroundSerializer(movie_bkgs, many=True)
        response = {'movie_bkgs': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)

    @action(detail=True, methods=['POST'])
    def rate_movie(self, request, pk=None):
        if 'stars' in request.data: 
            movie = Movie.objects.get(id=pk)
            stars = request.data['stars']
            user = request.user

            try: 
                rating = Rating.objects.get(user=user.id, movie=movie.id)
                rating.stars = stars
                rating.save()
                serializer = RatingSerializer(rating, many=False)
                response = {'message': 'Rating Updated.', 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)    
            except: 
                Rating.objects.create(user=user, movie=movie, stars=stars)
        else:
            response = {'message': 'You need to provide stars.'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['POST'])
    def set_movie_state(self, request, pk=None):
        if 'state' in request.data:
            movie = Movie.objects.get(id=pk)
            state = request.data['state']
            user = request.user

            movie.state = state
            movie.save()
            serializer = MovieSerializer(movie, many=False)
            response = {'message': 'State Updated.', 'result': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'You need to provide state.'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    
    @action(detail=False, methods=['GET'])
    def get_user_interested_list(self, request, pk=None): 
        #Store current user for filtering 
        user = request.user
        interested_state=1

        #Get list of all movies 
        movies = Movie.objects.all()
        
        #Create new queryset with filters added 
        interested_list = movies.filter(state=interested_state)
        serializer = MovieSerializer(interested_list, many=True)
        response = {'interested list': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def get_user_watched_list(self, request, pk=None): 
        #Store current user for filtering 
        user = request.user
        watched_state = 2

        #Get list of all movies 
        movies = Movie.objects.all()
        
        #Create new queryset with filters added 
        interested_list = movies.filter(state=watched_state)
        serializer = MovieSerializer(interested_list, many=True)
        response = {'interested list': serializer.data}
        return Response(response, status=status.HTTP_200_OK)


class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        response = {'message': 'You cant update a rating like that.'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'You cant create a rating like that.'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)