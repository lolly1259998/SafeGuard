import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EventService, Event } from '../../services/events/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];

  newEvent = {
    camera: '',
    event_type: '',
    confidence_score: 0,
    metadata: '',
    is_processed: false,
    notes: ''
  };

  constructor(
    private modalService: NgbModal,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  /** 🟢 Ouvre le modal Angular */
  openModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  /** 🔄 Charge les événements */
  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data: Event[]) => {
        console.log('Événements reçus:', data);
        this.events = data;
      },
      error: (err: any) => {
        console.error('Erreur de chargement:', err);
      }
    });
  }

  /** 🟢 Ajoute un événement */
  addEvent(): void {
    this.eventService.createEvent(this.newEvent).subscribe({
      next: () => {
        alert('✅ Event added successfully!');
        this.modalService.dismissAll();
        this.loadEvents();
      },
      error: (err) => console.error('Erreur d’ajout:', err)
    });
  }

  /** ✅ Marquer comme traité */
  markAsProcessed(event: Event): void {
    this.eventService.updateEvent(event.id, { is_processed: true }).subscribe({
      next: () => {
        event.is_processed = true;
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour:', err);
      }
    });
  }
}
