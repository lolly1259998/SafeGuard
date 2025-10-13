from rest_framework import viewsets
from .models import ControlCenter
from .serializers import ControlCenterSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ControlCenterViewSet(viewsets.ModelViewSet):
    queryset = ControlCenter.objects.all()
    serializer_class = ControlCenterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
