from django.urls import path,include
from .views import DashboardView
from .views_control_center import ControlCenterViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'controlcenters', ControlCenterViewSet)

urlpatterns = [
   path('', include(router.urls)),
]
