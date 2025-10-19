import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, Event } from '../../services/events/event.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data: Event[]) => {
        console.log('Événements reçus:', data);
        this.events = data;
      },
      error: (err: any) => {
        console.error('Erreur de chargement:', err);
      },
    });
  }

  markAsProcessed(event: Event): void {
    this.eventService.updateEvent(event.id, { is_processed: true }).subscribe({
      next: () => {
        event.is_processed = true;
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour:', err);
      },
    });
  }
}
