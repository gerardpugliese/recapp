# Generated by Django 3.0.2 on 2020-04-13 20:55

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0017_auto_20200413_2042'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='mark',
            unique_together={('user', 'movie_id')},
        ),
    ]
