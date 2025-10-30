from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardView
from Core.views_control_center import ControlCenterViewSet
from Core.views_ai_control_center import ai_performance_analysis, ai_recommendations  
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
    path('', include(router.urls)),
   # Routes IA pour centres de contrôle - AJOUTER CES DEUX LIGNES
      path('ai/control-centers/<int:control_center_id>/performance', 
        ai_performance_analysis, name='ai_performance_analysis'),
   path('ai/control-centers/<int:control_center_id>/recommendations', 
        ai_recommendations, name='ai_recommendations'),

]
