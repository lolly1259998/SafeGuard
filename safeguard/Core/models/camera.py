from django.db import models

from .controlCenter import ControlCenter

class Camera(models.Model):
    name = models.CharField(max_length=150)
    location = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    status = models.CharField(max_length=50, default='offline')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    control_center = models.ForeignKey(ControlCenter, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
