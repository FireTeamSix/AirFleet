# Generated by Django 3.2.5 on 2021-07-25 17:05

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logbook', '0007_auto_20210725_1203'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entry',
            name='aircraft_icao',
            field=models.CharField(blank=True, max_length=4, validators=[django.core.validators.RegexValidator(regex='/^[A-Z]{1}[A-Z0-9]{1,4}$/')]),
        ),
    ]
