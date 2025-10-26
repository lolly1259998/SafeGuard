import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // Ajout pour routerLink et queryParams
import { ScenarioService } from '../scenario.service';
import { SecurityScenario } from '../types';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],  // Ajout RouterModule ici
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  scenarios: SecurityScenario[] = [];
  showAddForm = false;
  editing = false;
  editForm: Partial<SecurityScenario> = {
    name: '',
    priority: 'medium',
    event_types: [],
    start_time: '',
    end_time: '',
    days_of_week: [],
    alert_email: false,
    alert_sms: false,
    save_recording: true,
    is_active: false,
    is_manual: true,
    apply_to_all_cameras: false
  };

  constructor(private scenarioService: ScenarioService) {}

  ngOnInit() {
    this.loadScenarios();
  }

  loadScenarios() {
    this.scenarioService.getAll().subscribe({
      next: (data) => {
        console.log('API Data:', data);
        this.scenarios = data || [];
        console.log('Scenarios length:', this.scenarios.length);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  addOrUpdateScenario() {
    if (!this.editForm.name) {
      alert('Name is required!');
      return;
    }
    if (this.editing && this.editForm.id) {
      this.scenarioService.update(this.editForm.id, this.editForm).subscribe({
        next: (updated) => {
          const index = this.scenarios.findIndex(s => s.id === updated.id);
          if (index !== -1) this.scenarios[index] = updated;
        }
      });
      this.editing = false;
    } else {
      this.scenarioService.create(this.editForm as SecurityScenario).subscribe({
        next: (created) => this.scenarios.push(created)
      });
    }
    this.showAddForm = false;
    this.resetEditForm();
  }

  editScenario(scenario: SecurityScenario) {
    this.editForm = { ...scenario,
      start_time: scenario.start_time || '',
      end_time: scenario.end_time || ''
    };
    this.editing = true;
    this.showAddForm = true;
  }

  resetEditForm() {
    this.editForm = {
      name: '',
      priority: 'medium',
      event_types: [],
      start_time: '',
      end_time: '',
      days_of_week: [],
      alert_email: false,
      alert_sms: false,
      save_recording: true,
      is_active: false,
      is_manual: true,
      apply_to_all_cameras: false
    };
  }

  toggleActive(id: number, active: boolean) {
    this.scenarioService.toggleActive(id, active).subscribe({
      next: () => this.loadScenarios(),
      error: (err) => console.error('Toggle error', err)
    });
  }

  deleteScenario(id: number) {
    if (confirm('Confirmer suppression?')) {
      this.scenarioService.delete(id).subscribe({
        next: () => this.loadScenarios(),
        error: (err) => console.error('Delete error', err)
      });
    }
  }
}