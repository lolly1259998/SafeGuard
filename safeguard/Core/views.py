from rest_framework import viewsets, serializers
from django.shortcuts import render
from django.views import View
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

from .models import Camera, ControlCenter, CameraUserAccess, ControlCenterUserAccess
from .serializers import (
    CameraSerializer,
    ControlCenterSerializer,
    CameraUserAccessSerializer,
    ControlCenterUserAccessSerializer
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
