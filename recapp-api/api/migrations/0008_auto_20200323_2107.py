# Generated by Django 3.0.3 on 2020-03-23 21:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20200319_1656'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='image',
            field=models.CharField(max_length=360),
        ),
    ]
