# Generated by Django 4.2.17 on 2025-01-23 19:15

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Flight',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('departure_airport', models.CharField(max_length=4, validators=[django.core.validators.MinLengthValidator(4)])),
                ('arrival_airport', models.CharField(max_length=4, validators=[django.core.validators.MinLengthValidator(4)])),
                ('departure_time', models.DateTimeField()),
                ('arrival_time', models.DateTimeField()),
                ('total_time', models.DurationField()),
                ('departure_gate', models.CharField(blank=True, max_length=10)),
                ('arrival_gate', models.CharField(blank=True, max_length=10)),
                ('flight_plan', models.TextField(blank=True)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-departure_time'],
            },
        ),
    ]
