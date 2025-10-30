# Core/ai/train.py
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.metrics import accuracy_score
from .model import create_model, save_model
from ..models import ControlCenterUserAccess, CameraUserAccess

def generate_training_data():
    """Génère des données d'entraînement simulées si la base est vide"""
    print("📊 Génération de données d'entraînement simulées...")
    
    data = []
    for i in range(100):
        user_id = np.random.randint(1, 10)
        access_level_numeric = np.random.choice([0, 1, 2], p=[0.6, 0.3, 0.1])
        
        hour = np.random.randint(0, 24)
        is_night = hour < 6 or hour > 22
        is_admin_night = (access_level_numeric == 2) and is_night
        
        is_suspicious = np.random.choice([0, 1], p=[0.9, 0.1])
        if is_admin_night:
            is_suspicious = 1
            
        data.append({
            'user_id': user_id,
            'access_level_numeric': access_level_numeric,
            'hour': hour,
            'is_suspicious': is_suspicious
        })
    
    return pd.DataFrame(data)

def train_access_model_from_db():
    """
    Entraîne le modèle IA à partir des données existantes dans la base.
    """
    print("🎯 Début de l'entraînement du modèle IA...")
    
    try:
        # Essayer de récupérer les données de la base avec les bons champs
        center_records = list(ControlCenterUserAccess.objects.all().values(
            'user_id', 'access_level', 'is_active', 'granted_at'  # Utiliser granted_at au lieu de created_at
        ))
        
        camera_records = list(CameraUserAccess.objects.all().values(
            'user_id', 'permission', 'is_active'  # Camera n'a pas granted_at
        ))

        if not center_records and not camera_records:
            print("⚠️ Pas de données en base, génération de données simulées...")
            df = generate_training_data()
        else:
            # Combinaison des données
            all_records = center_records + camera_records
            df = pd.DataFrame.from_records(all_records)
            
            # Préparation des features - CORRECTION ICI
            if 'granted_at' in df.columns:
                # Utiliser granted_at si disponible
                df['hour'] = pd.to_datetime(df['granted_at']).dt.hour
            else:
                # Sinon utiliser l'heure actuelle ou aléatoire
                df['hour'] = np.random.randint(0, 24, len(df))
            
            def map_access_level(level):
                if isinstance(level, str):
                    mapping = {
                        'view_only': 0, 'view_live': 0,
                        'operator': 1, 'view_history': 1,
                        'admin': 2, 'manage_alerts': 2,
                        'full_control': 3
                    }
                    return mapping.get(level, 0)
                return level
            
            # Gérer les deux types d'accès
            if 'access_level' in df.columns:
                df['access_level_numeric'] = df['access_level'].apply(map_access_level)
            elif 'permission' in df.columns:
                df['access_level_numeric'] = df['permission'].apply(map_access_level)
            else:
                df['access_level_numeric'] = 0
            
            # Création de la cible
            df['is_suspicious'] = df['is_active'].apply(lambda x: 1 if not x else 0)
            
            # Ajouter de la variabilité basée sur l'heure et les permissions
            df['is_suspicious'] = df.apply(lambda row: 
                1 if (row['access_level_numeric'] >= 2 and row['hour'] < 6) 
                else row['is_suspicious'], axis=1)

        # Features finales
        feature_columns = ['user_id', 'access_level_numeric', 'hour']
        X = df[feature_columns]
        y = df['is_suspicious']

        # Vérification des données
        if len(X) == 0:
            raise Exception("Aucune donnée disponible pour l'entraînement")

        print(f"📈 Données d'entraînement: {len(X)} échantillons")
        print(f"🎯 Répartition: {y.sum()} suspects, {len(y) - y.sum()} normaux")

        # Création et entraînement du modèle
        model = create_model()
        model.fit(X, y)

        # Calcul de l'accuracy
        y_pred = model.predict(X)
        accuracy = accuracy_score(y, y_pred)

        # Métadonnées
        metadata = {
            'accuracy': float(accuracy),
            'trained_samples': len(df),
            'last_training': datetime.now().isoformat(),
            'features': feature_columns,
            'class_distribution': {
                'suspicious': int(y.sum()),
                'normal': int(len(y) - y.sum())
            }
        }

        # Sauvegarde
        save_model(model, metadata)
        
        print("✅ Entraînement terminé avec succès!")
        
        return {
            "message": "✅ Modèle entraîné avec succès",
            "samples": len(df),
            "suspicious_count": int(y.sum()),
            "normal_count": int(len(y) - y.sum()),
            "accuracy": float(accuracy)
        }
        
    except Exception as e:
        print(f"❌ Erreur lors de l'entraînement: {e}")
        raise Exception(f"Erreur entraînement: {str(e)}")