from django.contrib import admin
from .models import Movie, Rating, MovieBackground, Mark, UserProfile, TopTen

admin.site.register(Movie)
admin.site.register(Rating)
admin.site.register(MovieBackground)
admin.site.register(Mark)
admin.site.register(UserProfile)
admin.site.register(TopTen)

