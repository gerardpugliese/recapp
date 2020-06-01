from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework import routers
from .views import MovieViewSet, RatingViewSet, UserViewSet, MovieBackgroundViewSet, MarkViewSet, UserProfileViewSet, TopTenViewSet

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('movies', MovieViewSet)
router.register('ratings', RatingViewSet)
router.register('moviebackground', MovieBackgroundViewSet)
router.register('mark', MarkViewSet)
router.register('userprofile', UserProfileViewSet)
router.register('topten', TopTenViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
