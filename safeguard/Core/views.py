from rest_framework import viewsets
from rest_framework.permissions import AllowAny  # FIXED: Allow anon read/write like friend's ControlCenter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication  # Optional, but keep for future
from django.contrib.auth.models import AnonymousUser
import random  # Pour simuler scores

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
    
    @action(detail=True, methods=['post'])
    def ai_analysis(self, request, pk=None):
        scenario = self.get_object()
        # Simulation simple basée sur tes champs
        event_count = len(scenario.event_types or [])
        priority_score = {'low': 60, 'medium': 75, 'high': 90, 'critical': 100}.get(scenario.priority, 70)
        condition_completeness = 80 if scenario.start_time and scenario.end_time else 50
        overall_score = int((priority_score + (event_count * 10) + condition_completeness) / 3)
        
        return Response({
            'performance_score': overall_score,
            'risk_level': 'LOW' if overall_score > 80 else 'MEDIUM' if overall_score > 60 else 'HIGH',
            'performance_data': {
                'event_coverage': {'score': event_count * 20, 'details': f'{event_count} types d\'événements couverts'},
                'condition_setup': {'score': condition_completeness, 'details': 'Conditions temporelles complètes' if scenario.start_time else 'Ajouter horaires'},
                'action_readiness': {'score': 85 if scenario.alert_email or scenario.alert_sms else 60, 'details': 'Actions d\'alerte configurées'},
            },
            'recommendations': [
                {'title': 'Améliorer couverture events', 'description': f'Ajouter {4 - event_count} types manquants' if event_count < 4 else 'Couverture optimale'},
                {'title': 'Vérifier priorité', 'description': f'Priorité {scenario.priority} - Aligner sur risques réels'},
            ],
            'ai_insights': [f'Scénario {scenario.name} optimisé pour {scenario.event_types or "tous events"}']
        })