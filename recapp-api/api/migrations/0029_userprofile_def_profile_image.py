# Generated by Django 3.0.2 on 2020-05-04 15:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_mark_rating'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='def_profile_image',
            field=models.ImageField(blank=True, upload_to='default_image'),
        ),
    ]
