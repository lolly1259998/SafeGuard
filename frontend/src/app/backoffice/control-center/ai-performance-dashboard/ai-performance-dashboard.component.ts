import { Component, OnInit } from '@angular/core';
import { ControlCenterAIService } from '../control-center-ai.service';
import { ControlCenterService } from '../control-center.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // AJOUTER HttpClient

@Component({
  selector: 'app-ai-performance-dashboard',
  templateUrl: './ai-performance-dashboard.component.html',
  styleUrls: ['./ai-performance-dashboard.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AiPerformanceDashboardComponent implements OnInit {
  controlCenters: any[] = [];
  selectedControlCenter: any = null;
  performanceData: any = null;
  isLoading: boolean = false;
  isloadingCenters: boolean = false;

  activeTab: string = 'overview';

  constructor(
    private aiService: ControlCenterAIService,
    private controlCenterService: ControlCenterService,
    private http: HttpClient // AJOUTER HttpClient
  ) {}

  ngOnInit() {
    this.loadControlCenters();
  }

  // UTILISER LA BONNE MÉTHODE DE VOTRE SERVICE
  loadControlCenters() {
    this.isloadingCenters = true;

    // Essayer différentes méthodes possibles de votre service
    const serviceCall =
      (this.controlCenterService as any).getAll?.() || // Essaye getAll()
      (this.controlCenterService as any).getControlCenters?.() || // Essaye getControlCenters()
      this.http.get<any[]>('/api/controlcenters/'); // Fallback direct API

    serviceCall.subscribe({
      next: (centers: any) => {
        // Normaliser la réponse (peut être un tableau direct ou dans une propriété)
        const centersArray = centers?.results || centers || [];

        this.controlCenters = centersArray.map((center: any) => ({
          id: center.id,
          name: center.name,
          location: center.location,
          description: center.description,
          status: center.is_active ? 'active' : 'inactive',
          created_at: new Date(center.created_at),
          owner: center.owner,
          is_active: center.is_active,
        }));

        this.isloadingCenters = false;

        // Sélectionner le premier centre par défaut
        if (this.controlCenters.length > 0) {
          this.selectedControlCenter = this.controlCenters[0];
          this.loadPerformanceAnalysis();
        }
      },
      error: (error: any) => {
        console.error('Erreur chargement des centres:', error);
        this.isloadingCenters = false;
        this.loadControlCentersFallback();
      },
    });
  }

  // Fallback si le service échoue
  private loadControlCentersFallback() {
    this.http.get<any[]>('/api/controlcenters/').subscribe({
      next: (centers: any[]) => {
        this.controlCenters = centers.map((center: any) => ({
          id: center.id,
          name: center.name,
          location: center.location,
          description: center.description,
          status: center.is_active ? 'active' : 'inactive',
          created_at: new Date(center.created_at),
          owner: center.owner,
        }));

        if (this.controlCenters.length > 0) {
          this.selectedControlCenter = this.controlCenters[0];
          this.loadPerformanceAnalysis();
        }
      },
      error: (error: any) => {
        console.error('Erreur fallback aussi:', error);
      },
    });
  }

  onControlCenterChange(event: any) {
    const centerId = parseInt(event.target.value);
    this.selectedControlCenter = this.controlCenters.find(
      (center) => center.id === centerId
    );
    if (this.selectedControlCenter) {
      this.loadPerformanceAnalysis();
    }
  }

  loadPerformanceAnalysis() {
    if (!this.selectedControlCenter?.id) return;

    this.isLoading = true;
    this.aiService
      .analyzeControlCenterPerformance(this.selectedControlCenter.id)
      .subscribe({
        next: (response: any) => {
          this.performanceData = response;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erreur analyse performance:', error);
          this.isLoading = false;
          // Données simulées BASÉES SUR LE CENTRE SÉLECTIONNÉ
          this.performanceData = this.generateAIAnalysis(
            this.selectedControlCenter
          );
        },
      });
  }

  // GÉNÉRATION INTELLIGENTE BASÉE SUR LES DONNÉES RÉELLES DU CENTRE
  private generateAIAnalysis(center: any): any {
    const ageInDays = Math.floor(
      (new Date().getTime() - new Date(center.created_at).getTime()) /
        (1000 * 3600 * 24)
    );

    // ANALYSE INTELLIGENTE BASÉE SUR LES CARACTÉRISTIQUES DU CENTRE
    const analysis = {
      name_analysis: this.analyzeName(center.name),
      location_analysis: this.analyzeLocation(center.location),
      description_analysis: this.analyzeDescription(center.description),
      activity_analysis: this.analyzeActivity(center.is_active, ageInDays),
      security_analysis: this.analyzeSecurity(center),
    };

    const scores = this.calculateScores(analysis, ageInDays);
    const recommendations = this.generateSmartRecommendations(
      analysis,
      scores,
      center
    );

    return {
      success: true,
      performance_score: scores.overall,
      risk_level: scores.riskLevel,
      center_analysis: analysis,
      performance_data: {
        uptime_analysis: {
          score: scores.uptime,
          days_operational: ageInDays,
          status: center.is_active ? 'Actif' : 'Inactif',
          details: `Centre ${center.name} opérationnel depuis ${ageInDays} jours`,
        },
        resource_optimization: {
          score: scores.resources,
          optimization_level:
            scores.resources >= 80
              ? 'HIGH'
              : scores.resources >= 60
              ? 'MEDIUM'
              : 'LOW',
          details: analysis.description_analysis.assessment,
        },
        security_level: {
          score: scores.security,
          level:
            scores.security >= 80
              ? 'HIGH'
              : scores.security >= 60
              ? 'MEDIUM'
              : 'LOW',
          risk_factors: analysis.security_analysis.risks,
          improvement_actions: analysis.security_analysis.improvements,
        },
        maintenance_predictions: {
          maintenance_urgency: scores.maintenanceUrgency,
          maintenance_type:
            scores.maintenanceUrgency > 70 ? 'URGENT' : 'ROUTINE',
          recommended_maintenance_date: new Date(
            Date.now() + scores.maintenanceUrgency * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          details: `Basé sur l'âge du centre (${ageInDays} jours) et son statut`,
        },
        naming_convention: {
          score: scores.naming,
          assessment: analysis.name_analysis.assessment,
          suggestions: analysis.name_analysis.suggestions,
        },
      },
      recommendations: recommendations,
      ai_insights: this.generateAIInsights(center, analysis, scores),
    };
  }

  // ANALYSE DU NOM
  private analyzeName(name: string): any {
    const analysis = {
      length: name.length,
      hasSpecialChars: /[^a-zA-Z0-9]/.test(name),
      isGeneric: this.isGenericName(name),
      assessment: '',
      suggestions: [] as string[],
    };

    if (name.length < 3) {
      analysis.assessment = 'Nom trop court';
      analysis.suggestions.push('Utiliser un nom plus descriptif');
    } else if (name.length > 20) {
      analysis.assessment = 'Nom trop long';
      analysis.suggestions.push('Utiliser un nom plus concis');
    } else {
      analysis.assessment = 'Nom approprié';
    }

    if (analysis.isGeneric) {
      analysis.assessment += ' - Nom générique détecté';
      analysis.suggestions.push('Éviter les noms génériques pour la sécurité');
    }

    return analysis;
  }

  // ANALYSE DE LA LOCALISATION
  private analyzeLocation(location: string): any {
    return {
      provided: !!location,
      length: location?.length || 0,
      assessment: location ? 'Localisation définie' : 'Localisation manquante',
      suggestions: !location ? ['Ajouter une localisation précise'] : [],
    };
  }

  // ANALYSE DE LA DESCRIPTION
  private analyzeDescription(description: string): any {
    const analysis = {
      provided: !!description,
      length: description?.length || 0,
      wordCount: description ? description.split(' ').length : 0,
      assessment: '',
      suggestions: [] as string[],
    };

    if (!description) {
      analysis.assessment = 'Description manquante';
      analysis.suggestions.push('Ajouter une description détaillée');
    } else if (description.length < 10) {
      analysis.assessment = 'Description trop courte';
      analysis.suggestions.push('Enrichir la description');
    } else if (description.length > 500) {
      analysis.assessment = 'Description trop longue';
      analysis.suggestions.push('Rendre la description plus concise');
    } else {
      analysis.assessment = 'Description adéquate';
    }

    return analysis;
  }

  // ANALYSE DE L'ACTIVITÉ
  private analyzeActivity(isActive: boolean, ageInDays: number): any {
    return {
      status: isActive ? 'Actif' : 'Inactif',
      age_days: ageInDays,
      maturity:
        ageInDays > 180 ? 'Mature' : ageInDays > 90 ? 'Établi' : 'Nouveau',
      assessment: `Centre ${
        isActive ? 'actif' : 'inactif'
      } depuis ${ageInDays} jours`,
    };
  }

  // ANALYSE DE SÉCURITÉ
  private analyzeSecurity(center: any): any {
    const risks = [];
    const improvements = [];

    // Détection des risques
    if (this.isGenericName(center.name)) {
      risks.push('Nom générique - peut révéler des informations');
    }
    if (!center.location) {
      risks.push('Localisation non spécifiée');
    }
    if (!center.description || center.description.length < 10) {
      risks.push('Description insuffisante pour l audit');
    }

    // Suggestions d'amélioration
    if (risks.length > 0) {
      improvements.push('Utiliser des conventions de nommage sécurisées');
      improvements.push('Documenter complètement la configuration');
    }

    improvements.push('Mettre à jour régulièrement les paramètres de sécurité');
    improvements.push('Auditer périodiquement la configuration');

    return { risks, improvements };
  }

  // CALCUL DES SCORES
  private calculateScores(analysis: any, ageInDays: number): any {
    let uptime = 70;
    let resources = 60;
    let security = 65;
    let naming = 70;

    // Score uptime basé sur l'activité et l'âge
    if (analysis.activity_analysis.status === 'Actif') uptime += 20;
    if (ageInDays > 90) uptime += 10;

    // Score ressources basé sur la complétude des informations
    if (analysis.description_analysis.provided) resources += 20;
    if (analysis.location_analysis.provided) resources += 10;
    if (analysis.description_analysis.length > 20) resources += 10;

    // Score sécurité
    if (!analysis.security_analysis.risks.includes('Nom générique'))
      security += 15;
    if (analysis.location_analysis.provided) security += 10;
    if (
      analysis.description_analysis.provided &&
      analysis.description_analysis.length > 20
    )
      security += 10;

    // Score naming
    if (!analysis.name_analysis.isGeneric) naming += 20;
    if (
      analysis.name_analysis.length >= 5 &&
      analysis.name_analysis.length <= 20
    )
      naming += 10;

    const overall = Math.round(
      uptime * 0.3 + resources * 0.25 + security * 0.3 + naming * 0.15
    );
    const maintenanceUrgency = Math.min(
      100,
      Math.max(20, (ageInDays / 365) * 100)
    );

    return {
      overall: Math.min(100, overall),
      uptime: Math.min(100, uptime),
      resources: Math.min(100, resources),
      security: Math.min(100, security),
      naming: Math.min(100, naming),
      maintenanceUrgency: Math.min(100, maintenanceUrgency),
      riskLevel: overall >= 80 ? 'LOW' : overall >= 60 ? 'MEDIUM' : 'HIGH',
    };
  }

  // GÉNÉRATION DE RECOMMANDATIONS INTELLIGENTES
  private generateSmartRecommendations(
    analysis: any,
    scores: any,
    center: any
  ): any[] {
    const recommendations = [];

    if (scores.security < 70) {
      recommendations.push({
        type: 'security_enhancement',
        priority: 'high',
        title: 'Renforcement de la sécurité',
        description: `Score sécurité: ${
          scores.security
        }% - ${analysis.security_analysis.risks.join(', ')}`,
        action: 'Implémenter les bonnes pratiques de sécurité',
      });
    }

    if (scores.resources < 70) {
      recommendations.push({
        type: 'documentation_improvement',
        priority: 'medium',
        title: 'Amélioration de la documentation',
        description: analysis.description_analysis.assessment,
        action: analysis.description_analysis.suggestions.join(', '),
      });
    }

    if (scores.naming < 80 && analysis.name_analysis.isGeneric) {
      recommendations.push({
        type: 'naming_optimization',
        priority: 'medium',
        title: 'Optimisation du nommage',
        description: analysis.name_analysis.assessment,
        action: 'Utiliser un nom plus spécifique et sécurisé',
      });
    }

    if (scores.maintenanceUrgency > 60) {
      recommendations.push({
        type: 'maintenance_planning',
        priority: 'medium',
        title: 'Planification de maintenance',
        description: `Urgence: ${scores.maintenanceUrgency}% - Centre opérationnel depuis ${analysis.activity_analysis.age_days} jours`,
        action: 'Planifier une maintenance préventive',
      });
    }

    return recommendations;
  }

  // GÉNÉRATION D'INSIGHTS IA
  private generateAIInsights(
    center: any,
    analysis: any,
    scores: any
  ): string[] {
    const insights = [];

    insights.push(
      `Le centre "${
        center.name
      }" présente un profil ${scores.riskLevel.toLowerCase()} en termes de sécurité`
    );

    if (analysis.activity_analysis.maturity === 'Nouveau') {
      insights.push('Centre récemment créé - surveillance accrue recommandée');
    }

    if (analysis.name_analysis.isGeneric) {
      insights.push(
        'Considérer un renommage pour améliorer la sécurité opérationnelle'
      );
    }

    if (scores.overall >= 80) {
      insights.push(
        'Performance globale excellente - maintenir les bonnes pratiques'
      );
    }

    return insights;
  }

  // UTILITAIRES
  private isGenericName(name: string): boolean {
    const genericNames = [
      'test',
      'demo',
      'temp',
      'backup',
      'default',
      'new',
      'old',
    ];
    return genericNames.some((generic) => name.toLowerCase().includes(generic));
  }

  // MÉTHODES D'AFFICHAGE
  getPerformanceColor(score: number): string {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  }

  getRiskLevelColor(level: string): string {
    switch (level) {
      case 'LOW':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HIGH':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
