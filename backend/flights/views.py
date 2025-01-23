from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Flight
from .serializers import FlightSerializer

class FlightListView(APIView):
    def get(self, request):
        flights = Flight.objects.all()
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FlightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FlightDetailView(APIView):
    def get_object(self, pk):
        try:
            return Flight.objects.get(pk=pk)
        except Flight.DoesNotExist:
            return None

    def get(self, request, pk):
        flight = self.get_object(pk)
        if not flight:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = FlightSerializer(flight)
        return Response(serializer.data)

    def put(self, request, pk):
        flight = self.get_object(pk)
        if not flight:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = FlightSerializer(flight, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        flight = self.get_object(pk)
        if not flight:
            return Response(status=status.HTTP_404_NOT_FOUND)
        flight.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
