# face_auth/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import face_recognition
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
KNOWN_DIR = BASE_DIR / "known_faces"

# Charge les visages au démarrage
ENCODINGS = []
NAMES = []

print("Chargement des visages autorisés...")
for file in KNOWN_DIR.glob("*.jpg"):
    try:
        img = face_recognition.load_image_file(file)
        enc = face_recognition.face_encodings(img)
        if enc:
            ENCODINGS.append(enc[0])
            name = file.stem.replace("_", " ").title()
            NAMES.append(name)
            print(f"   + {name}")
    except Exception as e:
        print(f"   - Erreur: {e}")

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
    
    if len(results) == 0:
        return JsonResponse({"message": "Aucun visage connu", "authorized": False})

    best_idx = distances.argmin()
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