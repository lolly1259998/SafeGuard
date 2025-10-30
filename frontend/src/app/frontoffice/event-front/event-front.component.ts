import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService, Event } from '../../services/events/event.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-front',
    standalone: true,

  imports: [CommonModule, RouterModule, NavbarComponent,FormsModule],
  templateUrl: './event-front.component.html',  
  styleUrl: './event-front.component.css'
})
export class EventFrontComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error = '';
  selectedEvent: Event | null = null;
currentPage = 1;
pageSize = 9;
totalPages = 1;
totalPagesArray: number[] = [];
filteredEvents: any[] = [];
paginatedEvents: any[] = [];
showAdvanced = false;
cameras: { id: number; name: string }[] = [];
eventTypes: { value: string; label: string }[] = [];

  constructor(
    private eventService: EventService,
    private modalService: NgbModal
  ) {}



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




applyFilters() {
  let result = this.events;

  // 🔍 Search
  if (this.filters.search.trim()) {
    const term = this.filters.search.toLowerCase();
    result = result.filter(e =>
      JSON.stringify(e).toLowerCase().includes(term)
    );
  }

  // 🎥 Camera
if (this.filters.camera)
  result = result.filter(e => e.camera === Number(this.filters.camera));

  // ⚠️ Type
  if (this.filters.event_type)
    result = result.filter(e => e.event_type === this.filters.event_type);

  // ✅ Status
  if (this.filters.status === 'processed') result = result.filter(e => e.is_processed);
  if (this.filters.status === 'pending') result = result.filter(e => !e.is_processed);

  // 🎯 Confidence
  result = result.filter(
    e =>
      e.confidence_score >= this.filters.minConfidence &&
      e.confidence_score <= this.filters.maxConfidence
  );

  // 📆 Date range
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

updatePagination() {
  this.totalPages = Math.ceil(this.filteredEvents.length / this.pageSize);
  this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  this.paginate();
}

paginate() {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.events = this.filteredEvents.slice(start, end);
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.paginate();
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.paginate();
  }
}

goToPage(page: number) {
  this.currentPage = page;
  this.paginate();
}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load events.';
        this.loading = false;
      }
    });
  }

 openDetails(event: Event, modal: any): void {
  this.selectedEvent = event;
  this.modalService.open(modal, { centered: true, size: 'lg' });
}


  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => this.loadEvents(),
        error: (err) => console.error(err)
      });
    }
  }
}