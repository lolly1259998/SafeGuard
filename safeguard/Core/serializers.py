from rest_framework import serializers
from .models import CameraUserAccess, ControlCenterUserAccess, Camera, ControlCenter, Event, User


class CameraSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True, required=False)

    class Meta:
        model = Camera
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class ControlCenterSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

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
