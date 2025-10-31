from rest_framework import viewsets, serializers
from django.shortcuts import render
from django.views import View
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response

from .models import Camera, ControlCenter, CameraUserAccess, ControlCenterUserAccess, Event, SecurityScenario, User
from .ai.predict import predict_access
from .ai.train import train_access_model_from_db
from .ai.model import get_model_info
from .serializers import (
    CameraSerializer,
    ControlCenterSerializer,
    CameraUserAccessSerializer,
    ControlCenterUserAccessSerializer,
    EventSerializer,
    UserSerializer,
    SecurityScenarioSerializer
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

class ControlCenterUserAccessViewSet(viewsets.ModelViewSet):
    queryset = ControlCenterUserAccess.objects.all()
    serializer_class = ControlCenterUserAccessSerializer
    permission_classes = [AllowAny]


    # === USERS ===
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# === EVENTS ===
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-timestamp')
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        event = serializer.save()
        # Auto-calcul d'un champ supplémentaire, ex : criticité
        if event.confidence_score >= 0.75:
            event.priority = "High"
        elif event.confidence_score >= 0.4:
            event.priority = "Medium"
        else:
            event.priority = "Low"
        event.save()


# === SECURITY SCENARIOS ===
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


# === ENDPOINTS IA ===
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated requests for development
def ai_access_predict(request):
    """
    Reçoit les données d'accès et renvoie une prédiction si l'accès est suspect ou normal.
    """
    try:
        features = request.data
        print(f"📨 Données reçues pour prédiction: {features}")
        
        result = predict_access(features)
        return Response(result)
    except Exception as e:
        error_msg = f"Erreur lors de la prédiction: {str(e)}"
        print(f"❌ {error_msg}")
        return Response({'error': error_msg}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated requests for development
def ai_train_from_db(request):
    """
    Réentraîne le modèle IA à partir des données de la base.
    """
    try:
        print("🚀 Début de l'entraînement via API...")
        result = train_access_model_from_db()
        return Response(result)
    except Exception as e:
        error_msg = f"Erreur lors de l'entraînement: {str(e)}"
        print(f"❌ {error_msg}")
        return Response({"error": error_msg}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow unauthenticated requests for development
def ai_model_info(request):
    """
    Retourne les informations du modèle IA.
    """
    try:
        info = get_model_info()
        return Response(info)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
