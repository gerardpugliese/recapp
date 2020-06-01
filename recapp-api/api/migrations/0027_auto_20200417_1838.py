# Generated by Django 3.0.2 on 2020-04-17 18:38

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0026_userprofile_most_recent_show'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mark',
            old_name='movie_id',
            new_name='item_id',
        ),
        migrations.AddField(
            model_name='mark',
            name='media_type',
            field=models.CharField(default='', max_length=30),
        ),
        migrations.AlterUniqueTogether(
            name='mark',
            unique_together={('user', 'item_id')},
        ),
        migrations.AlterIndexTogether(
            name='mark',
            index_together={('user', 'item_id')},
        ),
    ]
