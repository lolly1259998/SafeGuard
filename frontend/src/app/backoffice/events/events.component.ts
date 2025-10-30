import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('confirmDeleteModal') confirmDeleteModal: any;
@ViewChild('addEventModal') addEventModal: any;

  events: Event[] = [];
  cameras: any[] = [];
  users: any[] = [];  
  eventTypes = [
    { value: 'motion', label: 'Motion' },
    { value: 'unknown_face', label: 'Unknown Face' },
    { value: 'suspicious_object', label: 'Suspicious Object' },
    { value: 'intrusion', label: 'Intrusion' },
  ];
selectedEvent: any = null;

  newEvent = {
    camera: '',
    event_type: '',
    confidence_score: 0,
    metadata: '',
    is_processed: false,
    notes: '',
    processed_by: ''
  };

  constructor(
    private modalService: NgbModal,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
        this.loadCameras();
          this.loadUsers();


  }
loadCameras(): void {
    this.eventService.getCameras().subscribe({
      next: (data) => this.cameras = data,
      error: (err) => console.error('Error loading cameras:', err)
    });
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

  loadUsers(): void {
  this.eventService.getUsers().subscribe({
    next: (data) => this.users = data,
    error: (err) => console.error('Error loading users:', err)
  });
}

deleteEvent(id: number): void {
  if (!id) return;
  
  this.eventService.deleteEvent(id).subscribe({
    next: () => {
      this.loadEvents();
      this.modalService.dismissAll();
    },
    error: (err) => console.error('Erreur de suppression:', err)
  });
}



confirmDelete(event: any): void {
  this.selectedEvent = event;
  this.modalService.open(this.confirmDeleteModal, { centered: true });
}
@ViewChild('editEventModal') editEventModal: any;

/** 🟡 Ouvre le modal d’édition */
openEditModal(event: Event): void {
  this.selectedEvent = { ...event }; // Copie de l’objet pour éviter la mutation directe
  this.modalService.open(this.editEventModal, { centered: true, size: 'lg' });
}

/** ✏️ Met à jour un événement */
updateEvent(): void {
  if (!this.selectedEvent) return;

  this.eventService.updateEvent(this.selectedEvent.id, this.selectedEvent).subscribe({
    next: () => {
      alert('✏️ Event updated successfully!');
      this.loadEvents();          // recharge la liste
      this.modalService.dismissAll(); // ferme le modal
    },
    error: (err) => console.error('Erreur lors de la mise à jour:', err)
  });
}

}
