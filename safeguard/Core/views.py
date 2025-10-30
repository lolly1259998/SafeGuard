# Core/views.py - CORRIGÉ
from rest_framework import viewsets
from django.contrib.auth.models import User
from rest_framework import viewsets, serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Import correct des fonctions IA
from .ai.predict import predict_access
from .ai.train import train_access_model_from_db
from .ai.model import get_model_info  # IMPORT AJOUTÉ

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