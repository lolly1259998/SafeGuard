import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EventService, Event } from '../../services/events/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgbModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal: any;
  @ViewChild('addEventModal') addEventModal: any;
  @ViewChild('editEventModal') editEventModal: any;

  events: Event[] = [];
  filteredEvents: Event[] = [];
  paginatedEvents: Event[] = [];
  cameras: any[] = [];
  users: any[] = [];
  selectedEvent: any = null;

  // ✅ Pagination
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalPagesArray: number[] = [];

  // ✅ Filtres
  filters = {
    camera: '',
    event_type: '',
    startDate: '',
    endDate: '',
  };

  eventTypes = [
    { value: 'motion', label: 'Motion' },
    { value: 'unknown_face', label: 'Unknown Face' },
    { value: 'suspicious_object', label: 'Suspicious Object' },
    { value: 'intrusion', label: 'Intrusion' },
  ];

  newEvent = {
    camera: '',
    event_type: '',
    confidence_score: 0,
    metadata: '',
    is_processed: false,
    notes: '',
    processed_by: '',
    snapshot: null
  };

  constructor(private modalService: NgbModal, private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadCameras();
    this.loadUsers();
  }

  loadCameras(): void {
    this.eventService.getCameras().subscribe({
      next: (data) => (this.cameras = data),
      error: (err) => console.error('Error loading cameras:', err),
    });
  }
getSnapshotUrl(snapshot: string): string {
  if (!snapshot) return '';
  // Si le backend renvoie une URL complète
  if (snapshot.startsWith('http')) return snapshot;
  // Sinon on préfixe manuellement
  return 'http://127.0.0.1:8000' + snapshot;
}

openImageModal(imageUrl: string): void {
  if (imageUrl) window.open(imageUrl, '_blank');
}


  loadUsers(): void {
    this.eventService.getUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Error loading users:', err),
    });
  }

  getCameraName(cameraId: number): string {
    const cam = this.cameras.find((c) => c.id === cameraId);
    return cam ? cam.name : `#${cameraId}`;
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
        this.filteredEvents = [...data];
        this.updatePagination();
      },
      error: (err: any) => console.error('Erreur de chargement:', err),
    });
  }

  // ✅ Application des filtres
  applyFilters(): void {
    let result = [...this.events];

    // Filtre par caméra
    if (this.filters.camera) {
      result = result.filter((e) => e.camera === Number(this.filters.camera));
    }

    // Filtre par type
    if (this.filters.event_type) {
      result = result.filter((e) => e.event_type === this.filters.event_type);
    }

    // Filtre par date
    if (this.filters.startDate) {
      const start = new Date(this.filters.startDate);
      result = result.filter((e) => new Date(e.timestamp) >= start);
    }
    if (this.filters.endDate) {
      const end = new Date(this.filters.endDate);
      result = result.filter((e) => new Date(e.timestamp) <= end);
    }

    this.filteredEvents = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  // ✅ Pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEvents.length / this.pageSize) || 1;
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEvents = this.filteredEvents.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  goToPage(p: number): void {
    this.currentPage = p;
    this.paginate();
  }

  addEvent(): void {
    this.eventService.createEvent(this.newEvent).subscribe({
      next: () => {
        alert('✅ Event added successfully!');
        this.modalService.dismissAll();
        this.loadEvents();
      },
      error: (err) => console.error('Erreur d’ajout:', err),
    });
  }

  markAsProcessed(event: Event): void {
    this.eventService.updateEvent(event.id, { is_processed: true }).subscribe({
      next: () => (event.is_processed = true),
      error: (err) => console.error('Erreur lors de la mise à jour:', err),
    });
  }

  confirmDelete(event: any): void {
    this.selectedEvent = event;
    this.modalService.open(this.confirmDeleteModal, { centered: true });
  }

  deleteEvent(id: number): void {
    if (!id) return;
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.loadEvents();
        this.modalService.dismissAll();
      },
      error: (err) => console.error('Erreur de suppression:', err),
    });
  }

  openEditModal(event: Event): void {
    this.selectedEvent = { ...event };
    this.modalService.open(this.editEventModal, { centered: true, size: 'lg' });
  }
updateEvent() {
  if (!this.selectedEvent) return;

  const payload: any = {
    camera: this.selectedEvent.camera,
    event_type: this.selectedEvent.event_type,
    confidence_score: this.selectedEvent.confidence_score,
    is_processed: this.selectedEvent.is_processed,
    notes: this.selectedEvent.notes,
    metadata: this.selectedEvent.metadata,
  };

  if (this.selectedEvent.processed_by?.id) {
    payload.processed_by_id = this.selectedEvent.processed_by.id;
  }

  this.eventService.updateEvent(this.selectedEvent.id, payload).subscribe({
    next: () => {
      this.modalService.dismissAll();
      this.loadEvents();
      alert('✅ Event updated successfully!');
    },
    error: (err) => console.error('Erreur lors de la mise à jour:', err)
  });
}


  parseMetadata(metadata: any): any {
    try {
      return typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
    } catch {
      return {};
    }
  }
}
