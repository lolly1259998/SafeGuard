// src/app/frontoffice/scenarios/scenario-list/scenario-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScenarioCardComponent } from '../scenario-card/scenario-card.component';
import { ScenarioService, SecurityScenario } from '../../services/scenario.service';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-scenario-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ScenarioCardComponent ,    NavbarComponent,
  ],
  templateUrl: './scenario-list.component.html',
  styleUrl: './scenario-list.component.css'
})
export class ScenarioListComponent implements OnInit {
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