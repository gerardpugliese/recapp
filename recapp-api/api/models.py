from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models.signals import post_save

class UserProfile(models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #user image
    image = models.ImageField(upload_to='profile_image', blank=True)
    #default avatar image
    def_image = models.ImageField(upload_to='default_image', blank=True)
    #default profilbe bkg image
    def_profile_image = models.ImageField(upload_to='default_image', blank=True)
    #user stats
    movies_watched = models.IntegerField(default=0)
    shows_watched = models.IntegerField(default=0)
    highest_rated_movie = models.CharField(max_length=30, default='')
    highest_rated_show = models.CharField(max_length=30, default='')
    most_recent_movie = models.CharField(max_length=30, default='')
    most_recent_show = models.CharField(max_length=30, default='')
    top_ten_movies = models.CharField(max_length=200, default='')

def create_profile(sender, **kwargs):
    if kwargs['created']:
        user_profile = UserProfile.objects.create(user=kwargs['instance'])

post_save.connect(create_profile, sender=User)

class AppWideImages(models.Model):
    imdb_image = models.ImageField(upload_to='default_image', blank=True)
    rotten_tomatoes_image = models.ImageField(upload_to='default_image', blank=True)

class TopTen(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_id=models.CharField(max_length=30)
    media_type=models.CharField(max_length=30, default="")
    number = models.CharField(max_length=5, default="")
    img_link = models.CharField(max_length=300, default="")
    title = models.CharField(max_length=100, default="")

class Mark(models.Model):
    user = models.ForeignKey(User, related_name="marks", on_delete=models.CASCADE)
    item_id = models.CharField(max_length=30)
    media_type = models.CharField(max_length=30, default="")
    '''
    state int represents the movies state with possible values of
    0 - User has done nothing with it.
    1 - User has added it to their Watch List.
    2 - User has watched it.
    '''
    state = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(2)])
    is_favorite = models.BooleanField(default=False)
    rating = models.IntegerField(default=0)
    review = models.TextField(blank=True)

    class Meta:
        unique_together = (('user', 'item_id'),)
        index_together = (('user', 'item_id'),)


class Movie(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=360)
    image = models.CharField(max_length=360)
    
    def num_of_ratings(self):
        ratings = Rating.objects.filter(movie=self)
        return len(ratings)
    
    def avg_rating(self):
        sum = 0
        ratings = Rating.objects.filter(movie=self)
        
        for rating in ratings:
            sum += rating.stars

        if len(ratings) > 0:
            return (sum / len(ratings))
        else:
            return 0

    def __str__(self):
        return self.title

class Rating(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        unique_together = (('user', 'movie'),)
        index_together = (('user', 'movie'),)

class MovieBackground(models.Model):
    movie_name = models.CharField(max_length=360)
    movie_id = models.CharField(max_length=30, default='')

    def __str__ (self):
        return self.movie_name

