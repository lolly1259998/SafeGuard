from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views 
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
    path('api/ai/access/', views.ai_access_predict, name='ai-access'),
    path('api/ai/train/', views.ai_train_from_db, name='ai-train'),
    path('api/ai/model-info/', views.ai_model_info, name='model-info'),
]

