
from rest_framework import viewsets, serializers
from django.shortcuts import render
from django.views import View
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

from .models import Camera, ControlCenter, CameraUserAccess, ControlCenterUserAccess,Event,User
from .serializers import (
    CameraSerializer,
    ControlCenterSerializer,
    CameraUserAccessSerializer,
    ControlCenterUserAccessSerializer,EventSerializer, UserSerializer

)

# === DASHBOARD ===
class DashboardView(View):
    def get(self, request):
        return render(request, 'dashboard.html')

# === CONTROL CENTER ===
class ControlCenterViewSet(viewsets.ModelViewSet):
    queryset = ControlCenter.objects.all()
    serializer_class = ControlCenterSerializer
    permission_classes = [AllowAny]


# === CAMERA ===
class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = getattr(self.request, 'user', None)
        if user and user.is_authenticated:
            serializer.save(owner=user)
        else:
            serializer.save()

    def perform_update(self, serializer):
        user = getattr(self.request, 'user', None)
        if user and user.is_authenticated:
            serializer.save(owner=user)
        else:
            serializer.save()


# === CAMERA USER ACCESS ===
class CameraUserAccessViewSet(viewsets.ModelViewSet):
    queryset = CameraUserAccess.objects.all()
    serializer_class = CameraUserAccessSerializer
    permission_classes = [AllowAny]


# === CONTROL CENTER USER ACCESS ===
class ControlCenterUserAccessViewSet(viewsets.ModelViewSet):
    queryset = ControlCenterUserAccess.objects.all()
    serializer_class = ControlCenterUserAccessSerializer
    permission_classes = [AllowAny]


# === USERS ===
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]



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
