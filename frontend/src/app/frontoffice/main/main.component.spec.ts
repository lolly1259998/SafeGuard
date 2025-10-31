// src/app/frontoffice/main/main.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScenarioCardComponent } from '../scenarios/scenario-card/scenario-card.component';
import { ScenarioService, SecurityScenario } from '../services/scenario.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  scenarios: SecurityScenario[] = [];
  loading = true;
  error = false;

  constructor(private scenarioService: ScenarioService) {}

  ngOnInit(): void {
    this.scenarioService.getScenarios().subscribe({
      next: (data) => {
        this.scenarios = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}