from django.shortcuts import render
from django.views import View
from rest_framework import viewsets
from .models import ControlCenter
from .serializers import ControlCenterSerializer
from rest_framework.permissions import AllowAny
class DashboardView(View):
    def get(self, request):
        return render(request, 'dashboard.html')

class ControlCenterViewSet(viewsets.ModelViewSet):
    queryset = ControlCenter.objects.all()
    serializer_class = ControlCenterSerializer
    permission_classes = [AllowAny]