import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';  // Standalone directive
import { ChartConfiguration, ChartData, ChartType, Chart } from 'chart.js';  // Types + core for register
import { CategoryScale, LinearScale } from 'chart.js/auto';  // Auto-imports scales
import { ScenarioService } from '../scenario.service';
import { ScenarioAIService } from '../scenario-ai.service';
import { SecurityScenario } from '../types';

@Component({
  selector: 'app-ai-performance-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './ai-performance-dashboard.component.html',
  styleUrls: ['./ai-performance-dashboard.component.css']
})
export class AiPerformanceDashboardComponent implements OnInit {
  scenarios: SecurityScenario[] = [];
  selectedScenario: SecurityScenario | null = null;
  performanceData: any = null;
  isLoading: boolean = false;
  isloadingScenarios: boolean = false;

  // Chart.js Setup (Bar Chart pour sub-scores)
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Catégories' } },  // Auto category
      y: { beginAtZero: true, max: 100, title: { display: true, text: 'Score (%)' } }  // Auto linear
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed.y}%` } }
    }
  };

  constructor(
    private scenarioService: ScenarioService,
    private aiService: ScenarioAIService,
    private route: ActivatedRoute,
    private location: Location // ✅ inject Location here

  ) {}

  ngOnInit() {
    // Register scales (safe fallback – auto should handle, but explicit for v4+)
    Chart.register(CategoryScale, LinearScale);

    this.loadScenarios();
    this.route.queryParams.subscribe(params => {
      if (params['scenarioId']) {
        const id = +params['scenarioId'];
        this.selectedScenario = this.scenarios.find(s => s.id === id) || null;
        if (this.selectedScenario) {
          this.loadPerformanceAnalysis();
        }
      }
    });
  }

  loadScenarios() {
    this.isloadingScenarios = true;
    this.scenarioService.getAll().subscribe({
      next: (data) => {
        this.scenarios = data || [];
        this.isloadingScenarios = false;
        if (this.scenarios.length > 0 && !this.selectedScenario) {
          this.selectedScenario = this.scenarios[0];
          this.loadPerformanceAnalysis();
        }
      },
      error: (err) => {
        console.error('Erreur chargement scénarios:', err);
        this.isloadingScenarios = false;
      }
    });
  }

  onScenarioChange(event: any) {
    const scenarioId = parseInt(event.target.value);
    this.selectedScenario = this.scenarios.find(s => s.id === scenarioId) || null;
    if (this.selectedScenario) {
      this.loadPerformanceAnalysis();
    }
  }

  loadPerformanceAnalysis() {
    if (!this.selectedScenario?.id) return;

    this.isLoading = true;
    this.aiService.analyzeScenarioPerformance(this.selectedScenario.id).subscribe({
      next: (response) => {
        this.performanceData = response;
        this.updateChart();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur analyse performance:', error);
        this.isLoading = false;
        this.performanceData = this.generateAIAnalysis(this.selectedScenario!);
        this.updateChart();
      }
    });
  }

  // Mise à jour du Chart (basée sur performanceData – avec fallback pour priority)
  private updateChart() {
    if (!this.performanceData?.performance_data) return;

    const labels = ['Events', 'Conditions', 'Actions', 'Priority'];
    const scores = [
      this.performanceData.performance_data.event_coverage?.score || 0,
      this.performanceData.performance_data.condition_setup?.score || 0,
      this.performanceData.performance_data.action_readiness?.score || 0,
      this.performanceData.performance_data.priorityAssessment?.score || ({ low: 60, medium: 75, high: 90, critical: 100 }[this.selectedScenario?.priority || 'medium'] || 70)  // Fallback direct
    ];

    this.barChartData = {
      labels,
      datasets: [{
        data: scores,
        backgroundColor: scores.map(score => 
          score >= 80 ? '#28a745' : score >= 60 ? '#ffc107' : '#dc3545'
        ),
        borderColor: '#495057',
        borderWidth: 1
      }]
    };
  }

  // Génération IA Simulée (inchangée)
  private generateAIAnalysis(scenario: SecurityScenario): any {
    const eventCount = scenario.event_types?.length || 0;
    const hasTimeConditions = !!(scenario.start_time && scenario.end_time);
    const hasActions = scenario.alert_email || scenario.alert_sms || scenario.save_recording;
    const ageInDays = Math.floor((Date.now() - new Date(scenario.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24));

    const analysis = {
      eventCoverage: { score: Math.min(100, eventCount * 25), details: `${eventCount} types d'événements` },
      conditionSetup: { score: hasTimeConditions ? 90 : 50, details: hasTimeConditions ? 'Horaires définis' : 'Ajouter plages horaires' },
      actionReadiness: { score: hasActions ? 85 : 40, details: hasActions ? `Actions d\'alerte prêtes` : 'Configurer alertes' },
      priorityAssessment: { 
        score: { low: 60, medium: 75, high: 90, critical: 100 }[scenario.priority || 'medium'] || 70, 
        details: `Priorité ${scenario.priority}` 
      }
    };

    const overallScore = Math.round((analysis.eventCoverage.score + analysis.conditionSetup.score + analysis.actionReadiness.score + analysis.priorityAssessment.score) / 4);
    const riskLevel = overallScore >= 80 ? 'LOW' : overallScore >= 60 ? 'MEDIUM' : 'HIGH';

    const recommendations = [
      { title: 'Couvrir plus d\'événements', description: eventCount < 4 ? `Ajouter ${4 - eventCount} types` : 'Couverture optimale' },
      { title: 'Vérifier conditions', description: !hasTimeConditions ? 'Définir horaires/jours' : 'Conditions solides' },
      { title: 'Améliorer actions', description: !hasActions ? 'Activer email/SMS' : 'Actions complètes' },
      { title: 'Évaluer priorité', description: `Aligner sur risques réels pour ${scenario.priority}` }
    ].filter(rec => rec.description.includes('Ajouter') || rec.description.includes('Vérifier') || Math.random() > 0.5);

    return {
      performance_score: overallScore,
      risk_level: riskLevel,
      performance_data: analysis,
      recommendations,
      ai_insights: [
        `Scénario ${scenario.name} couvre ${eventCount} événements avec priorité ${scenario.priority}.`,
        ageInDays > 30 ? 'Scénario mature - revue périodique recommandée.' : 'Nouveau scénario - tester en conditions réelles.',
        `Risque global : ${riskLevel.toLowerCase()} basé sur complétude ${overallScore}%.`
      ]
    };
  }

  // Méthodes d'affichage (inchangées)
  getPerformanceColor(score: number): string {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  }

  getRiskLevelColor(level: string): string {
    switch (level) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'danger';
      default: return 'secondary';
    }
  }
goBack() {
  this.location.back(); 
}

}
