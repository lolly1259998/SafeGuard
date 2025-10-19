from django.shortcuts import render
from django.views import View
from .serializers import EventSerializer
from rest_framework import viewsets
from .models import Event

class DashboardView(View):
    def get(self, request):
        return render(request, 'dashboard.html')


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-timestamp')
    serializer_class = EventSerializer