# Generated by Django 3.0.2 on 2020-04-13 21:03

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0020_auto_20200413_2102'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='mark',
            unique_together={('user', 'movie_id')},
        ),
        migrations.AlterIndexTogether(
            name='mark',
            index_together={('user', 'movie_id')},
        ),
    ]
