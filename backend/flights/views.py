from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class FlightListView(APIView):
    def get(self, request):
        # Example data
        flights = [
            {"id": 1, "departure": "KJFK", "arrival": "KORD", "duration": "2:30"},
            {"id": 2, "departure": "KLAX", "arrival": "KSFO", "duration": "1:15"},
        ]
        return Response(flights, status=status.HTTP_200_OK)
