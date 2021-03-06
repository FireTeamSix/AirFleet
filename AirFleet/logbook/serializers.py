from rest_framework import serializers
from .models import entry
from rest_framework.reverse import reverse

class LogbookEntrySerializer(serializers.ModelSerializer):
    absolute_url = serializers.SerializerMethodField()

    class Meta:
        model = entry
        fields = [
            'id',
            'pilot_name',
            'flight_date',
            'aircraft_reg',
            'aircraft_icao',
            'from_dest',
            'to_dest',
            'duration',
            'remarks_and_endorsements',
            'absolute_url'
        ]

    def get_absolute_url(self, obj):
        return reverse('entry_detail', args=(obj.pk,))

class LogbookDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = entry
        fields = [
            'id',
            'pilot_name',
            'pilot_identifier',
            'copilot_name',
            'rental_company',
            'airline',
            'flight_date',
            'manufacturer',
            'aircraft_model',
            'aircraft_icao',
            'aircraft_reg',
            'flight_number',
            'from_dest',
            'to_dest',
            'duration',
            'category_and_class',
            'remarks_and_endorsements',
            'picture_with_plane'
        ]
