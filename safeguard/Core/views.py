from rest_framework import viewsets
from .models import Camera, Event, User
from .serializers import CameraSerializer, EventSerializer, UserSerializer

class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-timestamp')
    serializer_class = EventSerializer

    def perform_create(self, serializer):
        event = serializer.save()
        # Auto-calcul d’un champ supplémentaire, ex : criticité
        if event.confidence_score >= 0.75:
            event.priority = "High"
        elif event.confidence_score >= 0.4:
            event.priority = "Medium"
        else:
            event.priority = "Low"
        event.save()
        
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
