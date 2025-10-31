# backend/face_auth/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import face_recognition
from .face_engine import ENCODINGS, NAMES
import numpy as np

@csrf_exempt
def recognize_face(request):
    if request.method != "POST" or not request.FILES.get("photo"):
        return JsonResponse({"error": "Photo requise"}, status=400)

    photo = request.FILES["photo"]
    unknown = face_recognition.load_image_file(photo)
    unknown_enc = face_recognition.face_encodings(unknown)

    if not unknown_enc:
        return JsonResponse({"message": "Aucun visage détecté", "authorized": False})

    results = face_recognition.compare_faces(ENCODINGS, unknown_enc[0], tolerance=0.5)
    distances = face_recognition.face_distance(ENCODINGS, unknown_enc[0])
    best_idx = np.argmin(distances)

    if results[best_idx]:
        name = NAMES[best_idx]
        conf = round((1 - distances[best_idx]) * 100, 1)
        return JsonResponse({
            "name": name,
            "confidence": conf,
            "message": f"{name} – Accès autorisé",
            "authorized": True
        })
    else:
        return JsonResponse({
            "message": "Inconnu – Accès refusé",
            "authorized": False
        })