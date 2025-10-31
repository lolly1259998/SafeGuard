import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class TestAPIEndpoints:

    def setup_method(self):
        self.client = APIClient()

    def test_get_cameras(self):
        """Test GET /api/cameras/"""
        url = reverse('camera-list') if 'camera-list' in [u.name for u in self.client.handler._resolve_path_cache.keys()] else '/api/cameras/'
        response = self.client.get(url)
        assert response.status_code in [200, 204], f"Unexpected status: {response.status_code}"
        print("Cameras endpoint response:", response.json() if response.status_code == 200 else "No content")

    def test_get_events(self):
        """Test GET /api/events/"""
        url = reverse('event-list') if 'event-list' in [u.name for u in self.client.handler._resolve_path_cache.keys()] else '/api/events/'
        response = self.client.get(url)
        assert response.status_code in [200, 204], f"Unexpected status: {response.status_code}"
        print("Events endpoint response:", response.json() if response.status_code == 200 else "No content")
