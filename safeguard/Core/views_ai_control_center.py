# Core/views_ai_control_center.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class ControlCenterPerformanceAI:
    """
    IA spécialisée dans l'analyse des performances des centres de contrôle
    """
    
    @staticmethod
    def analyze_center_performance(control_center):
        """
        Analyse complète des performances d'un centre de contrôle
        """
        try:
            # 1. Métriques de base
            performance_data = {
                'center_id': control_center.id,
                'center_name': control_center.name,
                'analysis_date': datetime.now().isoformat(),
                'uptime_analysis': ControlCenterPerformanceAI.calculate_uptime(control_center),
                'resource_optimization': ControlCenterPerformanceAI.analyze_resources(control_center),
                'security_level': ControlCenterPerformanceAI.assess_security_level(control_center),
                'maintenance_predictions': ControlCenterPerformanceAI.predict_maintenance(control_center),
                'energy_efficiency': ControlCenterPerformanceAI.analyze_energy_usage(control_center)
            }

            # 2. CALCUL DU SCORE GLOBAL (avant tout le reste)
            performance_score = ControlCenterPerformanceAI.calculate_performance_score(performance_data)

            # 3. AJOUT du score dans performance_data
            performance_data['performance_score'] = performance_score

            # 4. Recommandations (peuvent maintenant utiliser le score)
            recommendations = ControlCenterPerformanceAI.generate_recommendations(performance_data)

            # 5. Niveau de risque (le score existe maintenant)
            risk_level = ControlCenterPerformanceAI.assess_risk_level(performance_data)

            return {
                'success': True,
                'performance_score': performance_score,
                'performance_data': performance_data,
                'recommendations': recommendations,
                'risk_level': risk_level
            }

        except Exception as e:
            logger.error(f"Erreur analyse IA centre {control_center.id}: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    # --------------------------------------------------------------------- #
    # Les méthodes suivantes restent **inchangées** (elles sont correctes) #
    # --------------------------------------------------------------------- #
    @staticmethod
    def calculate_uptime(control_center):
        creation_date = control_center.created_at
        days_operational = (datetime.now().date() - creation_date.date()).days
        base_score = min(95, 70 + (days_operational * 0.5))
        if control_center.is_active:
            base_score += 10
        else:
            base_score -= 15
        return {
            'score': min(100, max(0, base_score)),
            'days_operational': days_operational,
            'status_impact': 'active' if control_center.is_active else 'inactive'
        }

    @staticmethod
    def analyze_resources(control_center):
        resource_score = 75
        if control_center.description and len(control_center.description) > 50:
            resource_score += 5
        if control_center.location:
            resource_score += 10
        if not control_center.location:
            resource_score -= 15
        return {
            'score': min(100, max(0, resource_score)),
            'optimization_level': 'HIGH' if resource_score >= 80 else 'MEDIUM' if resource_score >= 60 else 'LOW',
            'suggestions': [
                "Compléter toutes les informations du centre",
                "Définir une localisation précise",
                "Ajouter une description détaillée"
            ]
        }

    @staticmethod
    def assess_security_level(control_center):
        security_factors = []
        security_score = 70
        if control_center.name and 'test' not in control_center.name.lower():
            security_score += 5
        else:
            security_factors.append("Nom du centre peu sécurisé")
        if control_center.location and 'demo' not in control_center.location.lower():
            security_score += 10
        else:
            security_factors.append("Localisation non sécurisée")
        return {
            'score': security_score,
            'level': 'HIGH' if security_score >= 80 else 'MEDIUM' if security_score >= 60 else 'LOW',
            'risk_factors': security_factors,
            'improvement_actions': [
                "Utiliser des noms génériques pour les centres",
                "Éviter les localisations précises dans les descriptions",
                "Mettre à jour régulièrement les paramètres de sécurité"
            ]
        }

    @staticmethod
    def predict_maintenance(control_center):
        creation_date = control_center.created_at
        days_since_creation = (datetime.now().date() - creation_date.date()).days
        maintenance_urgency = min(100, max(0, (days_since_creation / 365) * 100))
        return {
            'days_operational': days_since_creation,
            'maintenance_urgency': maintenance_urgency,
            'recommended_maintenance_date': (creation_date + timedelta(days=180)).strftime('%Y-%m-%d'),
            'maintenance_type': 'ROUTINE' if maintenance_urgency < 50 else 'URGENT'
        }

    @staticmethod
    def analyze_energy_usage(control_center):
        base_efficiency = 65
        if control_center.is_active:
            base_efficiency += 15
        if control_center.location:
            base_efficiency += 10
        return {
            'efficiency_score': base_efficiency,
            'estimated_energy_savings': f"{max(0, base_efficiency - 50)}%",
            'suggestions': [
                "Optimiser les heures d'activité",
                "Mettre en place des périodes de veille",
                "Surveiller la consommation énergétique"
            ]
        }

    @staticmethod
    def generate_recommendations(performance_data):
        recommendations = []
        if performance_data['uptime_analysis']['score'] < 80:
            recommendations.append({
                'type': 'availability_improvement',
                'priority': 'high',
                'title': 'Améliorer la disponibilité du centre',
                'description': f"Score de disponibilité faible: {performance_data['uptime_analysis']['score']}%",
                'action': 'Vérifier la configuration et les dépendances'
            })
        if performance_data['security_level']['score'] < 70:
            recommendations.append({
                'type': 'security_enhancement',
                'priority': 'high',
                'title': 'Renforcer la sécurité du centre',
                'description': f"Niveau de sécurité: {performance_data['security_level']['level']}",
                'action': 'Implémenter les bonnes pratiques de sécurité'
            })
        if performance_data['maintenance_predictions']['maintenance_urgency'] > 70:
            recommendations.append({
                'type': 'maintenance_required',
                'priority': 'medium',
                'title': 'Maintenance préventive requise',
                'description': f"Urgence maintenance: {performance_data['maintenance_predictions']['maintenance_urgency']}%",
                'action': 'Planifier une maintenance préventive'
            })
        if performance_data['resource_optimization']['score'] < 60:
            recommendations.append({
                'type': 'resource_optimization',
                'priority': 'medium',
                'title': 'Optimiser les ressources',
                'description': f"Score d'optimisation: {performance_data['resource_optimization']['score']}%",
                'action': performance_data['resource_optimization']['suggestions']
            })
        return recommendations

    @staticmethod
    def calculate_performance_score(performance_data):
        weights = {
            'uptime': 0.3,
            'resources': 0.25,
            'security': 0.25,
            'energy': 0.2
        }
        total_score = (
            performance_data['uptime_analysis']['score'] * weights['uptime'] +
            performance_data['resource_optimization']['score'] * weights['resources'] +
            performance_data['security_level']['score'] * weights['security'] +
            performance_data['energy_efficiency']['efficiency_score'] * weights['energy']
        )
        return round(total_score, 2)

    @staticmethod
    def assess_risk_level(performance_data):
        """Évalue le niveau de risque global"""
        performance_score = performance_data.get('performance_score', 0)
        if performance_score >= 80:
            return 'LOW'
        elif performance_score >= 60:
            return 'MEDIUM'
        else:
            return 'HIGH'

# --------------------------------------------------------------------- #
# Vues API (inchangées)                                                #
# --------------------------------------------------------------------- #
@csrf_exempt
@require_http_methods(["POST"])
def ai_performance_analysis(request, control_center_id):
    try:
        from .models import ControlCenter
        control_center = ControlCenter.objects.get(id=control_center_id)
        analysis_result = ControlCenterPerformanceAI.analyze_center_performance(control_center)
        return JsonResponse(analysis_result)
    except ControlCenter.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Centre de contrôle non trouvé'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def ai_recommendations(request, control_center_id):
    try:
        from .models import ControlCenter
        control_center = ControlCenter.objects.get(id=control_center_id)
        analysis = ControlCenterPerformanceAI.analyze_center_performance(control_center)
        return JsonResponse({
            'success': True,
            'recommendations': analysis.get('recommendations', []),
            'performance_score': analysis.get('performance_score', 0)
        })
    except ControlCenter.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Centre de contrôle non trouvé'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)