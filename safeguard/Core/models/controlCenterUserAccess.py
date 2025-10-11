from django.db import models
from .user import User
from .controlCenter import ControlCenter
from .camera import Camera

class ControlCenterUserAccess(models.Model):
    ACCESS_LEVEL_CHOICES = [
        ('view_only', 'Consultation'),
        ('operator', 'Opérateur'),
        ('admin', 'Administrateur'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    control_center = models.ForeignKey(ControlCenter, on_delete=models.CASCADE)
    access_level = models.CharField(max_length=20, choices=ACCESS_LEVEL_CHOICES, default='view_only')
    granted_at = models.DateTimeField(auto_now_add=True)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_center_accesses')
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'control_center')

    def __str__(self):
        return f"{self.user.username} - {self.control_center.name} ({self.access_level})"
