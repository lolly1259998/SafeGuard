// src/app/frontoffice/scenario-card/scenario-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SecurityScenario } from '../../services/scenario.service';

@Component({
  selector: 'app-scenario-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './scenario-card.component.html',
  styleUrl: './scenario-card.component.css'
})
export class ScenarioCardComponent {
  @Input() scenario!: SecurityScenario;

  getDaysOfWeekText(days: number[]): string {
    if (!days || days.length === 0) return 'None';
    if (days.length === 7) return 'Every day';
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => dayNames[day]).join(', ');
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    
    try {
      // Convert "22:00:00" to "10:00 PM" format
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString; // Return original if parsing fails
    }
  }
}