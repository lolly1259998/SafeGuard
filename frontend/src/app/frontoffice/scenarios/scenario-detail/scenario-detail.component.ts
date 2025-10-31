// src/app/frontoffice/scenarios/scenario-detail/scenario-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScenarioService, SecurityScenario } from '../../services/scenario.service';

@Component({
  selector: 'app-scenario-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './scenario-detail.component.html',
  styleUrl: './scenario-detail.component.css'
})
export class ScenarioDetailComponent implements OnInit {
  scenario!: SecurityScenario;
  loading = true;
  error = false;
  updating = false;

  constructor(
    private route: ActivatedRoute,
    private scenarioService: ScenarioService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadScenario(+id);
    }
  }

  loadScenario(id: number): void {
    this.loading = true;
    this.scenarioService.getScenarioById(id).subscribe({
      next: (data) => {
        this.scenario = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  toggleScenarioStatus(): void {
    if (!this.scenario || this.updating) return;

    this.updating = true;
    const newStatus = !this.scenario.is_active;

    this.scenarioService.updateScenarioStatus(this.scenario.id, newStatus).subscribe({
      next: (updatedScenario) => {
        this.scenario = updatedScenario;
        this.updating = false;
      },
      error: (error) => {
        console.error('Error updating scenario status:', error);
        this.updating = false;
        // Optional: Show error message to user
      }
    });
  }

  getDaysOfWeekText(days: number[]): string {
    if (!days || days.length === 0) return 'None';
    if (days.length === 7) return 'Every day';
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.map(day => dayNames[day]).join(', ');
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
}