from rest_framework import serializers
from .models import CameraUserAccess, ControlCenterUserAccess, Camera, ControlCenter

class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camera
        fields = '__all__'

class ControlCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlCenter
        fields = '__all__'

class CameraUserAccessSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    camera_name = serializers.CharField(source='camera.name', read_only=True)

    class Meta:
        model = CameraUserAccess
        fields = '__all__'

class ControlCenterUserAccessSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    center_name = serializers.CharField(source='center.name', read_only=True)

    class Meta:
        model = ControlCenterUserAccess
        fields = '__all__'
