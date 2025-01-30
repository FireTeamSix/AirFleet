from django.db import models
from django.core.validators import MinLengthValidator
from django.conf import settings

class Flight(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='flights'
    )

    CONDITION_CHOICES = [
        ('GROUNDED', 'Grounded'),
        ('MAINTENANCE', 'Needs Maintenance'),
        ('MINOR_ISSUES', 'Minor Issues'),
        ('GOOD', 'Good Condition'),
        ('AIRWORTHY', 'Airworthy'),
    ]

    departure_airport = models.CharField(max_length=4, validators=[MinLengthValidator(4)])
    arrival_airport = models.CharField(max_length=4, validators=[MinLengthValidator(4)])
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    total_time = models.DurationField()
    departure_gate = models.CharField(max_length=10, blank=True)
    arrival_gate = models.CharField(max_length=10, blank=True)
    flight_plan = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    photo = models.ImageField(upload_to='flight_photos/', null=True, blank=True)
    aircraft_condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES,
        default='AIRWORTHY'
    )
    registration_number = models.CharField(max_length=10)
    distance = models.IntegerField(
        default=0,
        help_text="Distance in nautical miles"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-departure_time']

    def __str__(self):
        return f"{self.departure_airport} → {self.arrival_airport} ({self.departure_time.date()})"
