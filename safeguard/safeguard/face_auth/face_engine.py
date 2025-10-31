# backend/face_auth/face_engine.py
import face_recognition
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
KNOWN_DIR = BASE_DIR / "known_faces"

def load_faces():
    encodings, names = [], []
    for file in KNOWN_DIR.glob("*.jpg"):
        img = face_recognition.load_image_file(file)
        enc = face_recognition.face_encodings(img)
        if enc:
            encodings.append(enc[0])
            names.append(file.stem.replace("_", " ").title())
    return encodings, names

ENCODINGS, NAMES = load_faces()