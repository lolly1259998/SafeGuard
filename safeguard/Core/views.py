from rest_framework import viewsets
from rest_framework.permissions import AllowAny  # FIXED: Allow anon read/write like friend's ControlCenter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication  # Optional, but keep for future
from django.contrib.auth.models import AnonymousUser

from .models import (
    User, Camera, ControlCenter, SecurityScenario, 
    CameraUserAccess, ControlCenterUserAccess
)
from .serializers import (
    SecurityScenarioSerializer, CameraSerializer, ControlCenterSerializer,
    CameraUserAccessSerializer, ControlCenterUserAccessSerializer, UserSerializer
)

# Users
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # FIXED: Like friend

# Cameras
class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer
    permission_classes = [AllowAny]  # FIXED: Like friend

# Control Centers
class ControlCenterViewSet(viewsets.ModelViewSet):
    queryset = ControlCenter.objects.all()
    serializer_class = ControlCenterSerializer
    permission_classes = [AllowAny]  # FIXED: Like friend

# Camera Access
class CameraUserAccessViewSet(viewsets.ModelViewSet):
    queryset = CameraUserAccess.objects.all()
    serializer_class = CameraUserAccessSerializer
    permission_classes = [AllowAny]  # FIXED: Like friend

# Control Center Access
class ControlCenterUserAccessViewSet(viewsets.ModelViewSet):
    queryset = ControlCenterUserAccess.objects.all()
    serializer_class = ControlCenterUserAccessSerializer
    permission_classes = [AllowAny]  # FIXED: Like friend

# Security Scenarios (no auth, no filter, plain array like friend's ControlCenter)
class SecurityScenarioViewSet(viewsets.ModelViewSet):
    queryset = SecurityScenario.objects.all()
    serializer_class = SecurityScenarioSerializer
    permission_classes = [AllowAny]  # FIXED: Allow anon read/write (no auth needed)
    pagination_class = None  # FIXED: No pagination (plain array like friend)

    def get_queryset(self):
        # FIXED: No user filter (shows all, like friend)
        return self.queryset.order_by('-is_active', 'name')

    def perform_create(self, serializer):
        # FIXED: No user assignment (optional for anon, like friend—defaults or skips)
        serializer.save()

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        scenario = self.get_object()
        scenario.is_active = not scenario.is_active
        scenario.save()
        serializer = self.get_serializer(scenario)
        return Response(serializer.data, status=200)

    @action(detail=False, methods=['get'])
    def active_scenarios(self, request):
        queryset = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)