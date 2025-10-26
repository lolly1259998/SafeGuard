import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, Event } from '../../services/events/event.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event-front',
    standalone: true,

  imports: [CommonModule, NavbarComponent],
  templateUrl: './event-front.component.html',
  styleUrl: './event-front.component.css'
})
export class EventFrontComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error = '';
  selectedEvent: Event | null = null;

  constructor(
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
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