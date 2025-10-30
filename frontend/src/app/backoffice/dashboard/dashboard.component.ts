// src/app/backoffice/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet   // ← AJOUTÉ
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {}