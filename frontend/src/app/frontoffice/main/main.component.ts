// src/app/frontoffice/main/main.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterLink],  // ← Only RouterLink
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {}