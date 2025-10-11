from django.contrib import admin
from .models import User, ControlCenter, ControlCenterUserAccess, CameraUserAccess, Camera


# Register your models here.
admin.site.register(User)
admin.site.register(ControlCenter)
admin.site.register(ControlCenterUserAccess)
admin.site.register(CameraUserAccess)
admin.site.register(Camera)


