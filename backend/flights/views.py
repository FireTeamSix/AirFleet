from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Flight
from .serializers import FlightSerializer
from rest_framework.permissions import IsAuthenticated
from django.http import Http404
import logging

logger = logging.getLogger(__name__)

class FlightListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        flights = Flight.objects.filter(user=request.user)
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)

    def post(self, request):
        logger.info(f"Received flight data: {request.data}")
        
        serializer = FlightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(
            {
                'status': 'error',
                'errors': serializer.errors,
                'message': 'Invalid flight data'
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )

class FlightDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Flight.objects.get(pk=pk, user=user)
        except Flight.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        flight = self.get_object(pk, request.user)
        serializer = FlightSerializer(flight)
        return Response(serializer.data)

    def put(self, request, pk):
        flight = self.get_object(pk, request.user)
        serializer = FlightSerializer(flight, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        flight = self.get_object(pk, request.user)
        flight.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
