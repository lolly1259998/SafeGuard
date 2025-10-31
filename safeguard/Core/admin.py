from django.contrib import admin
from .models import (
    User, Camera, ControlCenter, SecurityScenario, CameraUserAccess, 
    ControlCenterUserAccess, Event, Alert
)  # FIXED: Import all models explicitly (instead of 'allModels')

# Custom Admin for SecurityScenario (your module – CRUD-friendly)
@admin.register(SecurityScenario)
class SecurityScenarioAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_active', 'priority', 'get_preview']
    list_filter = ['is_active', 'priority', 'event_types', 'user']
    list_editable = ['is_active']  # Toggle direct en liste
    search_fields = ['name', 'user__username']
    filter_horizontal = ['cameras']  # UI pour ManyToMany
    raw_id_fields = ['control_center', 'user']  # Pour FKs lourdes

    def get_preview(self, obj):
        return obj.get_preview()
    get_preview.short_description = 'Aperçu'

# Basic registrations for other models (from allModels list)
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'is_active']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email']

@admin.register(Camera)
class CameraAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'status', 'owner']
    list_filter = ['status', 'owner']
    search_fields = ['name', 'location']

@admin.register(ControlCenter)
class ControlCenterAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'is_active', 'owner']
    list_filter = ['is_active', 'owner']
    filter_horizontal = []  # Add if ManyToMany added later
    search_fields = ['name']

@admin.register(CameraUserAccess)
class CameraUserAccessAdmin(admin.ModelAdmin):
    list_display = ['user', 'camera', 'permission', 'is_active']
    list_filter = ['permission', 'is_active']
    raw_id_fields = ['user', 'camera', 'granted_by']

@admin.register(ControlCenterUserAccess)
class ControlCenterUserAccessAdmin(admin.ModelAdmin):
    list_display = ['user', 'control_center', 'access_level', 'is_active']
    list_filter = ['access_level', 'is_active']
    raw_id_fields = ['user', 'control_center', 'granted_by']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['event_type', 'camera', 'timestamp', 'is_processed']
    list_filter = ['event_type', 'is_processed', 'camera']
    search_fields = ['notes']
    raw_id_fields = ['camera', 'processed_by']
    date_hierarchy = 'timestamp'

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['alert_type', 'priority', 'event', 'user', 'is_read']
    list_filter = ['alert_type', 'priority', 'is_read']
    raw_id_fields = ['event', 'user']
    date_hierarchy = 'sent_at'