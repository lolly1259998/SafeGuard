from rest_framework import viewsets
from django.contrib.auth.models import User
from rest_framework import viewsets, serializers

from .models import Camera, ControlCenter, CameraUserAccess, ControlCenterUserAccess
from .serializers import (
    CameraSerializer,
    ControlCenterSerializer,
    CameraUserAccessSerializer,
    ControlCenterUserAccessSerializer
)

class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

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

class ControlCenterViewSet(viewsets.ModelViewSet):
    queryset = ControlCenter.objects.all()
    serializer_class = ControlCenterSerializer

class CameraUserAccessViewSet(viewsets.ModelViewSet):
    queryset = CameraUserAccess.objects.all()
    serializer_class = CameraUserAccessSerializer

class ControlCenterUserAccessViewSet(viewsets.ModelViewSet):
    queryset = ControlCenterUserAccess.objects.all()
    serializer_class = ControlCenterUserAccessSerializer

    # === USERS ===
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

