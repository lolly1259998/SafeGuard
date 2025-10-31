import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService, Event } from '../../services/events/event.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-front',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
  templateUrl: './event-front.component.html',
  styleUrls: ['./event-front.component.css']
})
export class EventFrontComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  paginatedEvents: Event[] = [];
  cameras: { id: number; name: string }[] = [];
  eventTypes: { value: string; label: string }[] = [];
  selectedEvent: Event | null = null;

  loading = false;
  error = '';
  showAdvanced = false;

  // Pagination
  currentPage = 1;
  pageSize = 9;
  totalPages = 1;
  totalPagesArray: number[] = [];

  // Filtres
  filters = {
    search: '',
    camera: '',
    event_type: '',
    status: '',
    minConfidence: 0,
    maxConfidence: 1,
    startDate: '',
    endDate: ''
  };

  constructor(
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadCameras();
    this.loadEventTypes();
  }

  /** 🔹 Charger les événements */
  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = [...data];
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load events.';
        this.loading = false;
      }
    });
  }

  /** 🎥 Charger la liste des caméras */
  loadCameras(): void {
    this.eventService.getCameras().subscribe({
      next: (data) => (this.cameras = data),
      error: (err) => console.error('Error loading cameras:', err)
    });
  }

  /** 🧠 Charger les types d’événements */
  loadEventTypes(): void {
    // Tu peux remplacer cette liste par un GET API si ton backend la fournit
    this.eventTypes = [
      { value: 'motion', label: 'Motion' },
      { value: 'unknown_face', label: 'Unknown Face' },
      { value: 'suspicious_object', label: 'Suspicious Object' },
      { value: 'intrusion', label: 'Intrusion' }
    ];
  }

  /** 🔍 Application des filtres */
  applyFilters(): void {
    let result = [...this.events];

    // Search
    if (this.filters.search.trim()) {
      const term = this.filters.search.toLowerCase();
      result = result.filter(e => JSON.stringify(e).toLowerCase().includes(term));
    }

    // Camera
    if (this.filters.camera) {
      result = result.filter(e => e.camera === Number(this.filters.camera));
    }

    // Event type
    if (this.filters.event_type) {
      result = result.filter(e => e.event_type === this.filters.event_type);
    }

    // Status
    if (this.filters.status === 'processed') result = result.filter(e => e.is_processed);
    if (this.filters.status === 'pending') result = result.filter(e => !e.is_processed);

    // Confidence
    result = result.filter(
      e =>
        e.confidence_score >= this.filters.minConfidence &&
        e.confidence_score <= this.filters.maxConfidence
    );

    // Date range
    if (this.filters.startDate) {
      const start = new Date(this.filters.startDate);
      result = result.filter(e => new Date(e.timestamp) >= start);
    }
    if (this.filters.endDate) {
      const end = new Date(this.filters.endDate);
      result = result.filter(e => new Date(e.timestamp) <= end);
    }

    this.filteredEvents = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  /** 🔢 Pagination */
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

  goToPage(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  /** 👁️ Ouvrir les détails */
  openDetails(event: Event, modal: any): void {
    this.selectedEvent = event;
    this.modalService.open(modal, { centered: true, size: 'lg' });
  }

  /** ❌ Supprimer un événement */
  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => this.loadEvents(),
        error: (err) => console.error(err)
      });
    }
  }
}
