from django.db import migrations, models
import django.db.models.deletion

def set_default_user(apps, schema_editor):
    Flight = apps.get_model('flights', 'Flight')
    User = apps.get_model('users', 'CustomUser')
    
    # Get the first user or create one if none exists
    default_user = User.objects.first()
    if not default_user:
        default_user = User.objects.create_user(
            username='default_user',
            email='default@example.com',
            password='defaultpassword123'
        )
    
    # Update all existing flights to use the default user
    Flight.objects.filter(user__isnull=True).update(user=default_user)

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('flights', '0002_flight_aircraft_condition_flight_photo_and_more'),  # Updated to match actual migration name
    ]

    operations = [
        migrations.AddField(
            model_name='flight',
            name='user',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to='users.customuser',
                related_name='flights'
            ),
        ),
        migrations.RunPython(set_default_user),
        migrations.AlterField(
            model_name='flight',
            name='user',
            field=models.ForeignKey(
                null=False,
                on_delete=django.db.models.deletion.CASCADE,
                to='users.customuser',
                related_name='flights'
            ),
        ),
    ] 