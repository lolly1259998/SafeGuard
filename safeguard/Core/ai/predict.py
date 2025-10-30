import pandas as pd
import numpy as np
from datetime import datetime
from .model import load_model

def prepare_features(features: dict) -> pd.DataFrame:
    """Prépare les features pour la prédiction"""
    def map_access_level(level):
        if isinstance(level, str):
            mapping = {
                'view_only': 0, 'view_live': 0,
                'operator': 1, 'view_history': 1,
                'admin': 2, 'manage_alerts': 2,
                'full_control': 3
            }
            return mapping.get(level, 0)
        return level if isinstance(level, (int, float)) else 0
    
    access_level_numeric = map_access_level(
        features.get('access_level', features.get('permission', 0))
    )
    
    current_time = datetime.now()
    
    prepared = {
        'user_id': features.get('user_id', 0),
        'access_level_numeric': access_level_numeric,
        'hour': current_time.hour,
        'user_access_frequency': features.get('user_access_frequency', 1)
    }
    
    return pd.DataFrame([prepared])

def predict_access(features: dict) -> dict:
    """
    Prédit si un accès est suspect.
    """
    print(f"🔍 Prédiction pour les features: {features}")
    
    model, metadata = load_model()
    
    if model is None:
        return {
            "suspicious": False,
            "confidence": 0,
            "risk_level": "Inconnu",
            "model_accuracy": "N/A",
            "error": "Modèle non entraîné",
            "recommendation": "Veuillez entraîner le modèle d'abord"
        }
    
    try:
        df = prepare_features(features)
        
        available_features = metadata.get('features', ['user_id', 'access_level_numeric', 'hour'])
        df = df[[col for col in available_features if col in df.columns]]
        
        print(f"📊 Features préparées: {df.to_dict('records')[0]}")
        
        prediction = model.predict(df)[0]
        probabilities = model.predict_proba(df)[0]
        
        confidence = float(probabilities[1] if prediction == 1 else probabilities[0])
        
        if prediction == 1:
            if confidence > 0.8:
                risk_level = "Très Élevé"
            elif confidence > 0.6:
                risk_level = "Élevé"
            else:
                risk_level = "Moyen"
        else:
            if confidence > 0.9:
                risk_level = "Très Faible"
            elif confidence > 0.7:
                risk_level = "Faible"
            else:
                risk_level = "Modéré"
        
        recommendation = "Accès normal" if prediction == 0 else "Accès suspect - Investigation recommandée"
        
        result = {
            "suspicious": bool(prediction),
            "confidence": round(confidence, 3),
            "risk_level": risk_level,
            "model_accuracy": metadata.get('accuracy', 'N/A'),
            "recommendation": recommendation,
            "features_used": list(df.columns)
        }
        
        print(f"🎯 Résultat prédiction: {result}")
        
        return result
        
    except Exception as e:
        error_msg = f"Erreur de prédiction: {str(e)}"
        print(f"❌ {error_msg}")
        return {
            "suspicious": False,
            "confidence": 0,
            "risk_level": "Erreur",
            "model_accuracy": "N/A",
            "error": error_msg
        }