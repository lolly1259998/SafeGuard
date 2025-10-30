from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth.models import AnonymousUser
import random

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
    permission_classes = [AllowAny]

# Cameras
class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer
    permission_classes = [AllowAny]

# Control Centers
class ControlCenterViewSet(viewsets.ModelViewSet):
    queryset = ControlCenter.objects.all()
    serializer_class = ControlCenterSerializer
    permission_classes = [AllowAny]

# Camera Access
class CameraUserAccessViewSet(viewsets.ModelViewSet):
    queryset = CameraUserAccess.objects.all()
    serializer_class = CameraUserAccessSerializer
    permission_classes = [AllowAny]

# Control Center Access
class ControlCenterUserAccessViewSet(viewsets.ModelViewSet):
    queryset = ControlCenterUserAccess.objects.all()
    serializer_class = ControlCenterUserAccessSerializer
    permission_classes = [AllowAny]

# Security Scenarios
class SecurityScenarioViewSet(viewsets.ModelViewSet):
    queryset = SecurityScenario.objects.all()
    serializer_class = SecurityScenarioSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return self.queryset.order_by('-is_active', 'name')

    def perform_create(self, serializer):
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
        
        # Calculate scores based on scenario configuration
        event_count = len(scenario.event_types or [])
        priority_score = {'low': 60, 'medium': 75, 'high': 90, 'critical': 100}.get(scenario.priority, 70)
        condition_completeness = 80 if scenario.start_time and scenario.end_time else 50
        action_score = 85 if scenario.alert_email or scenario.alert_sms else 60
        recording_score = 90 if scenario.save_recording else 50
        
        # Calculate overall score (weighted average)
        overall_score = int((
            priority_score + 
            (min(100, event_count * 25)) +  # Event coverage max 100%
            condition_completeness + 
            action_score +
            recording_score
        ) / 5)
        
        # Determine risk level
        if overall_score >= 80:
            risk_level = 'LOW'
            risk_description = 'Low Risk - Minimal security concerns'
        elif overall_score >= 60:
            risk_level = 'MEDIUM'
            risk_description = 'Medium Risk - Standard monitoring required'
        else:
            risk_level = 'HIGH'
            risk_description = 'High Risk - Enhanced monitoring needed'
        
        # Generate recommendations
        recommendations = []
        
        # Event coverage recommendation
        if event_count < 3:
            recommendations.append({
                'title': 'Improve Event Coverage', 
                'description': f'Add {3 - event_count} more event types for comprehensive security monitoring'
            })
        else:
            recommendations.append({
                'title': 'Event Coverage Status',
                'description': 'Good event coverage - maintain current configuration'
            })
        
        # Time conditions recommendation
        if not (scenario.start_time and scenario.end_time):
            recommendations.append({
                'title': 'Configure Time Restrictions',
                'description': 'Define specific time schedules to optimize scenario activation periods'
            })
        else:
            recommendations.append({
                'title': 'Time Configuration Status',
                'description': 'Time restrictions properly configured'
            })
        
        # Alert system recommendation
        if not (scenario.alert_email or scenario.alert_sms):
            recommendations.append({
                'title': 'Enable Alert Notifications',
                'description': 'Activate email or SMS alerts for immediate incident response'
            })
        else:
            alert_types = []
            if scenario.alert_email:
                alert_types.append('email')
            if scenario.alert_sms:
                alert_types.append('SMS')
            recommendations.append({
                'title': 'Alert System Status',
                'description': f'Alert notifications enabled: {", ".join(alert_types)}'
            })
        
        # Recording recommendation
        if not scenario.save_recording:
            recommendations.append({
                'title': 'Enable Video Recording',
                'description': 'Activate video recording for evidence collection and analysis'
            })
        else:
            recommendations.append({
                'title': 'Recording System Status',
                'description': 'Video recording enabled for security events'
            })
        
        # Priority assessment
        recommendations.append({
            'title': 'Priority Level Assessment',
            'description': f'{scenario.priority.title()} priority - Ensure alignment with actual security requirements'
        })
        
        # Generate AI insights
        ai_insights = [
            f'Scenario "{scenario.name}" is configured to monitor {event_count} event type(s)',
            f'Current priority level: {scenario.priority.title()} - Overall security score: {overall_score}%',
            f'Risk assessment: {risk_level} - {risk_description}',
        ]
        
        # Add context-specific insights
        if event_count >= 3:
            ai_insights.append('Excellent event coverage - scenario monitors multiple security threats')
        else:
            ai_insights.append('Consider expanding event coverage for more comprehensive protection')
        
        if scenario.start_time and scenario.end_time:
            ai_insights.append('Time-based activation configured - optimizes resource usage')
        else:
            ai_insights.append('24/7 monitoring active - consider adding time restrictions for efficiency')
        
        if scenario.alert_email or scenario.alert_sms:
            ai_insights.append('Alert system ready for immediate incident response')
        else:
            ai_insights.append('Enable alert notifications for faster security response')
        
        if scenario.save_recording:
            ai_insights.append('Video recording enabled - valuable for incident analysis and evidence')
        else:
            ai_insights.append('Video recording disabled - enable for complete security coverage')
        
        # Add days of week insight
        if scenario.days_of_week and len(scenario.days_of_week) < 7:
            day_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            active_days = [day_names[day] for day in scenario.days_of_week]
            ai_insights.append(f'Active on specific days: {", ".join(active_days)}')
        elif scenario.days_of_week and len(scenario.days_of_week) == 7:
            ai_insights.append('Active all week - continuous monitoring enabled')
        else:
            ai_insights.append('Daily activation - consistent security coverage')
        
        return Response({
            'performance_score': overall_score,
            'risk_level': risk_level,
            'risk_description': risk_description,
            'performance_data': {
                'event_coverage': {
                    'score': min(100, event_count * 25), 
                    'details': f'{event_count} event type(s) configured',
                    'max_score': 100
                },
                'condition_setup': {
                    'score': condition_completeness, 
                    'details': 'Time conditions configured' if scenario.start_time and scenario.end_time else 'Time schedules needed',
                    'max_score': 100
                },
                'action_readiness': {
                    'score': action_score, 
                    'details': 'Alert system active' if scenario.alert_email or scenario.alert_sms else 'Configure alert actions',
                    'max_score': 100
                },
                'recording_setup': {
                    'score': recording_score,
                    'details': 'Video recording enabled' if scenario.save_recording else 'Enable recording feature',
                    'max_score': 100
                },
                'priority_assessment': {
                    'score': priority_score,
                    'details': f'Priority level: {scenario.priority.title()}',
                    'max_score': 100
                }
            },
            'recommendations': recommendations,
            'ai_insights': ai_insights,
            'scenario_overview': {
                'name': scenario.name,
                'event_types': scenario.event_types or [],
                'priority': scenario.priority,
                'is_active': scenario.is_active,
                'has_time_restrictions': bool(scenario.start_time and scenario.end_time),
                'has_alerts': bool(scenario.alert_email or scenario.alert_sms),
                'has_recording': scenario.save_recording,
                'active_days_count': len(scenario.days_of_week) if scenario.days_of_week else 7
            }
        })