

from rest_framework import viewsets, serializers
from django.shortcuts import render
from django.views import View
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

from .models import Camera, ControlCenter, CameraUserAccess, ControlCenterUserAccess,Event,User

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ai.predict import predict_access
from .ai.train import train_access_model_from_db
from .ai.model import get_model_info  # IMPORT AJOUTÉ
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

class ControlCenterUserAccessViewSet(viewsets.ModelViewSet):
    queryset = ControlCenterUserAccess.objects.all()
    serializer_class = ControlCenterUserAccessSerializer


# === USERS ===
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


# === ENDPOINTS IA ===
@api_view(['POST'])
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
def ai_model_info(request):
    """
    Retourne les informations du modèle IA.
    """
    try:
        info = get_model_info()
        return Response(info)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

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
