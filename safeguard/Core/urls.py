from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    CameraViewSet,
    ControlCenterViewSet,
    CameraUserAccessViewSet,
    ControlCenterUserAccessViewSet
)

router = DefaultRouter()
router.register('users', UserViewSet) 
router.register('cameras', CameraViewSet)
router.register('controlcenters', ControlCenterViewSet)
router.register('cameraaccess', CameraUserAccessViewSet)
router.register('centeraccess', ControlCenterUserAccessViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
