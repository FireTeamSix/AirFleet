from rest_framework import serializers
from .models import Flight
from datetime import datetime, timedelta

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'
        read_only_fields = ('user',)  # Make user field read-only
    
    def validate(self, data):
        """
        Check that departure_time is before arrival_time and total_time matches
        """
        if data['departure_time'] >= data['arrival_time']:
            raise serializers.ValidationError("Departure time must be before arrival time")
        
        duration = data['arrival_time'] - data['departure_time']
        
        if abs((duration - data['total_time']).total_seconds()) > 1:
            raise serializers.ValidationError("Total time does not match departure and arrival times")
        
        if data['distance'] < 0:
            raise serializers.ValidationError("Distance cannot be negative")
        
        return data 