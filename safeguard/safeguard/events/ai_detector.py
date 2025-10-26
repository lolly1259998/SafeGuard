import cv2
import torch
import requests
from datetime import datetime

API_URL = "http://127.0.0.1:8000/api/events/"  # ton endpoint Django REST

# Chargement du modèle YOLOv8 (ou YOLOv5)
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

def analyze_stream(camera_id, stream_url):
    cap = cv2.VideoCapture(stream_url)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Détection
        results = model(frame)
        detections = results.pandas().xyxy[0]  # dataframe avec les détections

        for _, det in detections.iterrows():
            label = det['name']
            confidence = float(det['confidence'])

            # Définir la criticité
            if label in ['person', 'knife', 'gun']:
                priority = 'High'
            elif label in ['car', 'dog']:
                priority = 'Medium'
            else:
                priority = 'Low'

            # Sauvegarder une image clé
            snapshot_path = f"media/events/snapshot_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
            cv2.imwrite(snapshot_path, frame)

            # Création automatique d’un Event dans Django via API
            data = {
                "camera": camera_id,
                "event_type": label,
                "confidence_score": confidence,
                "metadata": f"priority={priority}",
                "is_processed": False,
                "notes": "Détection automatique IA",
            }

            try:
                response = requests.post(API_URL, data=data)
                print(f"[+] Event créé : {label} ({confidence:.2f}) → {response.status_code}")
            except Exception as e:
                print(f"Erreur API : {e}")

    cap.release()
    cv2.destroyAllWindows()
