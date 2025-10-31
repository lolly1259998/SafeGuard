import torch
import cv2
import requests
import json
import time
import os

DJANGO_API_URL = "http://127.0.0.1:8000/api/events/"
CAMERA_ID = 1
TEST_IMAGE = "cat.jpg"
DETECTION_INTERVAL = 10
REPEAT_DELAY = 30
SNAPSHOT_DIR = os.path.join("media", "events_snapshots")
os.makedirs(SNAPSHOT_DIR, exist_ok=True)


print("🔍 Chargement du modèle YOLOv5...")
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
print("✅ Modèle chargé avec succès !")

last_event = None
last_event_time = 0

while True:
    if not os.path.exists(TEST_IMAGE):
        print(f"❌ Image {TEST_IMAGE} introuvable.")
        break

    frame = cv2.imread(TEST_IMAGE)
    results = model(frame)
    detections = results.pandas().xyxy[0]

    if detections.empty:
        print("⚠️ Aucune détection trouvée.")
    else:
        obj = detections.iloc[0]
        confidence = round(float(obj['confidence']), 2)
        label = obj['name']
        now = time.time()
        current_event = f"{label}_{confidence}"

        x1, y1, x2, y2 = map(int, [obj['xmin'], obj['ymin'], obj['xmax'], obj['ymax']])
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f"{label} ({confidence*100:.1f}%)", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        snapshot_name = f"event_{int(time.time())}.jpg"
        snapshot_path = os.path.join(SNAPSHOT_DIR, snapshot_name)
        cv2.imwrite(snapshot_path, frame)

        if current_event == last_event and (now - last_event_time) < REPEAT_DELAY:
            print(f"⏸️ Même détection ({label}, {confidence}) ignorée.")
        else:
            files = {'snapshot': open(snapshot_path, 'rb')}
            data = {
                "camera": CAMERA_ID,
                "event_type": "motion",
                "confidence_score": confidence,
                "metadata": json.dumps({
                    "object_class": label,
                    "zone": "Entrée principale"
                })
            }

            try:
                r = requests.post(DJANGO_API_URL, data=data, files=files)
                if r.status_code in [200, 201]:
                    print(f"✅ Événement envoyé avec image : {snapshot_name}")
                    last_event = current_event
                    last_event_time = now
                else:
                    print(f"⚠️ Erreur API ({r.status_code}): {r.text}")
            except Exception as e:
                print(f"🚨 Erreur envoi API : {e}")

    cv2.imshow("Détection IA - SafeGuard", frame)
    if cv2.waitKey(1000) & 0xFF == ord('q'):
        break

    time.sleep(DETECTION_INTERVAL)

cv2.destroyAllWindows()