# Generated by Django 3.0.2 on 2020-04-10 03:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20200410_0147'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mark',
            name='movie_genre',
        ),
    ]
