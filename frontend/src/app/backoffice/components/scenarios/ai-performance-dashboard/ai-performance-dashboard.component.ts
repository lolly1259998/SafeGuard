import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, Chart } from 'chart.js';
import { CategoryScale, LinearScale } from 'chart.js/auto';
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

  // Chart.js Setup
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Categories' } },
      y: { beginAtZero: true, max: 100, title: { display: true, text: 'Score (%)' } }
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
    private location: Location
  ) {}

  ngOnInit() {
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
        console.error('Error loading scenarios:', err);
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
        this.performanceData = this.translateResponse(response);
        this.updateChart();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in performance analysis:', error);
        this.isLoading = false;
        this.performanceData = this.generateAIAnalysis(this.selectedScenario!);
        this.updateChart();
      }
    });
  }

  private translateResponse(response: any): any {
    if (!response) return response;

    const translated = { ...response };

    // Translate recommendations
    if (translated.recommendations) {
      translated.recommendations = translated.recommendations.map((rec: any) => {
        const translatedRec = { ...rec };
        
        // Translate titles
        if (translatedRec.title) {
          translatedRec.title = translatedRec.title
            .replace('Améliorer couverture events', 'Improve Event Coverage')
            .replace('Vérifier priorité', 'Review Priority Level')
            .replace('Améliorer actions', 'Enhance Alert Actions')
            .replace('Vérifier conditions', 'Verify Time Conditions');
        }
        
        // Translate descriptions
        if (translatedRec.description) {
          translatedRec.description = translatedRec.description
            .replace(/Ajouter (\d+) types? manquants?/, 'Add $1 missing event types')
            .replace(/Priorité (\w+) - Aligner sur risques réels/, '$1 priority - Align with actual risks')
            .replace(/Activer email\/SMS/, 'Enable email/SMS alerts')
            .replace(/Définir horaires\/jours/, 'Define time schedules');
        }
        
        return translatedRec;
      });
    }

    // Translate AI insights
    if (translated.ai_insights) {
      translated.ai_insights = translated.ai_insights.map((insight: string) => {
        return insight
          .replace(/Scénario (.+) optimisé pour/, 'Scenario $1 optimized for')
          .replace(/Scénario (.+) couvre/, 'Scenario $1 covers')
          .replace(/types d'événements/, 'event types')
          .replace(/avec priorité/, 'with priority')
          .replace(/Scénario mature/, 'Mature scenario')
          .replace(/revue périodique recommandée/, 'periodic review recommended')
          .replace(/Nouveau scénario/, 'New scenario')
          .replace(/tester en conditions réelles/, 'test in real conditions')
          .replace(/Risque global/, 'Overall risk')
          .replace(/basé sur complétude/, 'based on completeness');
      });
    }

    return translated;
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  }

  getRiskLevelDescription(level: string): string {
    const descriptions: { [key: string]: string } = {
      'low': 'Low Risk - Minimal security concerns',
      'medium': 'Medium Risk - Standard monitoring required', 
      'high': 'High Risk - Enhanced monitoring needed',
      'critical': 'Critical Risk - Immediate attention required',
      'LOW': 'Low Risk - Minimal security concerns',
      'MEDIUM': 'Medium Risk - Standard monitoring required',
      'HIGH': 'High Risk - Enhanced monitoring needed',
      'CRITICAL': 'Critical Risk - Immediate attention required'
    };
    return descriptions[level] || level;
  }

  getPerformanceColor(score: number): string {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  }

  getRiskLevelColor(level: string): string {
    const levelLower = level.toLowerCase();
    switch (levelLower) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      case 'critical': return 'danger';
      default: return 'secondary';
    }
  }

  private updateChart() {
    if (!this.performanceData?.performance_data) return;

    const labels = ['Events', 'Conditions', 'Actions', 'Priority'];
    const scores = [
      this.performanceData.performance_data.event_coverage?.score || 0,
      this.performanceData.performance_data.condition_setup?.score || 0,
      this.performanceData.performance_data.action_readiness?.score || 0,
      this.performanceData.performance_data.priorityAssessment?.score || ({ low: 60, medium: 75, high: 90, critical: 100 }[this.selectedScenario?.priority || 'medium'] || 70)
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

  private generateAIAnalysis(scenario: SecurityScenario): any {
    const eventCount = scenario.event_types?.length || 0;
    const hasTimeConditions = !!(scenario.start_time && scenario.end_time);
    const hasActions = scenario.alert_email || scenario.alert_sms || scenario.save_recording;
    const ageInDays = Math.floor((Date.now() - new Date(scenario.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24));

    const analysis = {
      event_coverage: { score: Math.min(100, eventCount * 25), details: `${eventCount} event types` },
      condition_setup: { score: hasTimeConditions ? 90 : 50, details: hasTimeConditions ? 'Time ranges defined' : 'Add time schedules' },
      action_readiness: { score: hasActions ? 85 : 40, details: hasActions ? 'Alert actions ready' : 'Configure alerts' },
      priorityAssessment: { 
        score: { low: 60, medium: 75, high: 90, critical: 100 }[scenario.priority || 'medium'] || 70, 
        details: `Priority ${scenario.priority}` 
      }
    };

    const overallScore = Math.round((analysis.event_coverage.score + analysis.condition_setup.score + analysis.action_readiness.score + analysis.priorityAssessment.score) / 4);
    const riskLevel = overallScore >= 80 ? 'LOW' : overallScore >= 60 ? 'MEDIUM' : 'HIGH';

    const recommendations = [
      { 
        title: 'Improve Event Coverage', 
        description: eventCount < 4 ? `Add ${4 - eventCount} event types for better security coverage` : 'Optimal event coverage achieved' 
      },
      { 
        title: 'Verify Time Conditions', 
        description: !hasTimeConditions ? 'Define specific time schedules for scenario activation' : 'Time conditions properly configured' 
      },
      { 
        title: 'Enhance Alert Actions', 
        description: !hasActions ? 'Enable email/SMS alerts and recording features' : 'Alert actions are properly configured' 
      },
      { 
        title: 'Review Priority Level', 
        description: `Ensure ${scenario.priority} priority aligns with actual security risks` 
      }
    ].filter(rec => !rec.description.includes('properly') && !rec.description.includes('achieved'));

    return {
      performance_score: overallScore,
      risk_level: riskLevel,
      performance_data: analysis,
      recommendations: recommendations.slice(0, 3),
      ai_insights: [
        `Scenario "${scenario.name}" monitors ${eventCount} event types with ${scenario.priority} priority level.`,
        ageInDays > 30 ? 'This is a mature scenario - consider periodic review and optimization.' : 'New scenario detected - recommend testing in controlled environment.',
        `Security coverage: ${overallScore}% complete. ${riskLevel === 'HIGH' ? 'Immediate improvements recommended.' : 'Maintain current monitoring.'}`,
        `Event types configured: ${scenario.event_types?.join(', ') || 'None'}`,
        hasTimeConditions ? `Active during: ${this.formatTime(scenario.start_time!)} - ${this.formatTime(scenario.end_time!)}` : 'No time restrictions configured'
      ]
    };
  }

  goBack() {
    this.location.back(); 
  }
}