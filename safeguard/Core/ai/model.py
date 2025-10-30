import os
import joblib
from sklearn.ensemble import RandomForestClassifier

# Emplacement du modèle
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'access_model.pkl')
MODEL_METADATA_PATH = os.path.join(os.path.dirname(__file__), 'model_metadata.pkl')

def create_model():
    """Crée un modèle RandomForest prêt à l'entraînement."""
    return RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight="balanced"
    )

def save_model(model, metadata=None):
    """Sauvegarde du modèle entraîné."""
    joblib.dump(model, MODEL_PATH)
    if metadata:
        joblib.dump(metadata, MODEL_METADATA_PATH)

def load_model():
    """Charge le modèle s'il existe."""
    if not os.path.exists(MODEL_PATH):
        return None, None
    try:
        model = joblib.load(MODEL_PATH)
        metadata = joblib.load(MODEL_METADATA_PATH) if os.path.exists(MODEL_METADATA_PATH) else {}
        return model, metadata
    except Exception as e:
        print(f"Erreur chargement modèle: {e}")
        return None, None

def get_model_info():
    """Retourne les informations du modèle"""
    model, metadata = load_model()
    if model is None:
        return {"status": "not_trained", "message": "Modèle non entraîné"}
    
    return {
        "status": "trained",
        "accuracy": metadata.get('accuracy', 'N/A'),
        "trained_samples": metadata.get('trained_samples', 0),
        "last_training": metadata.get('last_training'),
        "features_used": metadata.get('features', [])
    }