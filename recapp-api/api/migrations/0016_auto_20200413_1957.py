# Generated by Django 3.0.2 on 2020-04-13 19:57

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_remove_mark_movie_genre'),
    ]

    operations = [
        migrations.AddField(
            model_name='mark',
            name='is_favorite',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='mark',
            name='state',
            field=models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(2)]),
        ),
    ]
