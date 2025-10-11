from django.db import models
from .user import User
from .controlCenter import ControlCenter
from .camera import Camera


class CameraUserAccess(models.Model):
    PERMISSION_CHOICES = [
        ('view_live', 'Voir en direct'),
        ('view_history', 'Voir l’historique'),
        ('manage_alerts', 'Gérer les alertes'),
        ('full_control', 'Contrôle total'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE)
    permission_type = models.CharField(max_length=30, choices=PERMISSION_CHOICES, default='view_live')
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_camera_accesses')
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'camera')

    def __str__(self):
        return f"{self.user.username} → {self.camera.name} ({self.permission_type})"
