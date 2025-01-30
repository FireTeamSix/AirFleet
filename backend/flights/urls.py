from django.urls import path
from .views import FlightListView, FlightDetailView

urlpatterns = [
    path('flights/', FlightListView.as_view(), name='flight-list'),
    path('flights/<int:pk>/', FlightDetailView.as_view(), name='flight-detail'),
] 