# Generated by Django 3.0.3 on 2020-05-14 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_userprofile_top_ten_movies'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='top_ten_movies',
            field=models.CharField(default=',,,,,,,,,', max_length=200),
        ),
    ]
