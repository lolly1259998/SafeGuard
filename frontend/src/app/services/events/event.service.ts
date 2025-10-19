import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id: number;
  camera: number;
  event_type: string;
  timestamp: string;
  confidence_score: number;
  is_processed: boolean;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://127.0.0.1:8000/api/events/'; // 🔗 ton API Django

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer tous les événements
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  // 🔹 Mettre à jour un événement
  updateEvent(id: number, data: any): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}${id}/`, data);
  }

  // 🔹 Supprimer un événement
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
  // Ajouter un nouvel événement
 createEvent(eventData: any): Observable<any> {
    return this.http.post(this.apiUrl, eventData);
  }

}
