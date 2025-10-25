from django.urls import path,include
from .views import DashboardView
from Core.views_control_center import ControlCenterViewSet
from rest_framework.routers import DefaultRouter
from Core.views_ai_control_center import ai_performance_analysis, ai_recommendations  

router = DefaultRouter()
router.register(r'controlcenters', ControlCenterViewSet)

urlpatterns = [
   path('', include(router.urls)),
   # Routes IA pour centres de contrôle - AJOUTER CES DEUX LIGNES
      path('ai/control-centers/<int:control_center_id>/performance', 
        ai_performance_analysis, name='ai_performance_analysis'),
   path('ai/control-centers/<int:control_center_id>/recommendations', 
        ai_recommendations, name='ai_recommendations'),
]
