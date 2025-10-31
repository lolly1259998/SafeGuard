from rest_framework import serializers
from .models import CameraUserAccess, ControlCenterUserAccess, Camera, ControlCenter, Event, SecurityScenario, User

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
    snapshot = serializers.ImageField(required=False, allow_null=True)
    metadata = serializers.JSONField(required=False)
    processed_by = UserSerializer(read_only=True)  # lecture
    processed_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='processed_by',
        write_only=True,
        required=False,
        allow_null=True
    )
    class Meta:
        model = Event
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
    center_name = serializers.CharField(source='control_center.name', read_only=True)

    class Meta:
        model = ControlCenterUserAccess
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_active']

class SecurityScenarioSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    control_center_name = serializers.CharField(source='control_center.name', read_only=True, allow_null=True)
    camera_names = serializers.SerializerMethodField(read_only=True)
    preview = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SecurityScenario
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'user', 'user_name', 'preview']
        extra_kwargs = {
            'cameras': {'required': False, 'many': True},
        }

    def get_camera_names(self, obj):
        return [camera.name for camera in obj.cameras.all()]

    def get_preview(self, obj):
        return obj.get_preview()

    def validate_event_types(self, value):
        # FIXED: Skip validation if empty (no raise)
        if not value:
            return []
        if not isinstance(value, list):
            value = []
        valid_types = [choice[0] for choice in SecurityScenario.EVENT_TYPES]
        clean_value = [et for et in value if et in valid_types]
        if not clean_value and value:
            raise serializers.ValidationError("Au moins un type d'événement valide requis.")
        return clean_value

    def validate_days_of_week(self, value):
        # FIXED: Skip validation if empty (no raise, safe conversion)
        if not value:
            return []
        if not isinstance(value, list):
            value = []
        days = []
        for d in value:
            if d:  # FIXED: Skip empty strings
                try:
                    day_int = int(d)
                    if 0 <= day_int <= 6:
                        days.append(day_int)
                except (ValueError, TypeError):
                    pass  # FIXED: Ignore invalid, no raise
        return days

    def create(self, validated_data):
        # FIXED: Get or create a default user if not authenticated
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user_id'] = request.user.id
        else:
            # Get or create a default anonymous user
            default_user, created = User.objects.get_or_create(
                username='anonymous',
                defaults={
                    'email': 'anonymous@safeguard.local',
                    'role': 'user',
                    'is_active': True
                }
            )
            validated_data['user_id'] = default_user.id
        # FIXED: Default empty for optional
        validated_data.setdefault('event_types', [])
        validated_data.setdefault('days_of_week', [])
        cameras_data = validated_data.pop('cameras', [])
        instance = super().create(validated_data)
        if cameras_data:
            instance.cameras.set(cameras_data)
        return instance

    def update(self, instance, validated_data):
        cameras_data = validated_data.pop('cameras', None)
        instance = super().update(instance, validated_data)
        if cameras_data is not None:
            instance.cameras.set(cameras_data)
        return instance