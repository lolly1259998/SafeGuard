from rest_framework import serializers
from .models import ControlCenter

class ControlCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlCenter
        fields = '__all__'
        