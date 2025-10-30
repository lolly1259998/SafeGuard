import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

export interface Event {
  id: number;
  camera: number;
  event_type: string;
  timestamp: string;
  confidence_score: number;
  is_processed: boolean;
  notes: string;
  metadata?: string;          
  processed_by?: number | {   
    id: number;
    username: string;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://127.0.0.1:8000/api/events/'; // 🔗 ton API Django
  private apiUrlCamera = 'http://127.0.0.1:8000/api/cameras/'; // 🔗 ton API Django

  private apiUrlUser = 'http://127.0.0.1:8000/api/users/'; // 🔗 ton API Django
  constructor(private http: HttpClient,private snackBar: MatSnackBar ) {}


  // ✅ Message popup
  private showMessage(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  // 🔹 Récupérer tous les événements
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  // 🔹 Ajouter un nouvel événement
  createEvent(eventData: any): Observable<any> {
    return this.http.post(this.apiUrl, eventData).pipe(
      tap(() => this.showMessage('✅ Event successfully created!'))
    );
  }

  // 🔹 Modifier un événement
  updateEvent(id: number, data: any): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}${id}/`, data).pipe(
      tap(() => this.showMessage('✏️ Event successfully updated!'))
    );
  }

  // 🔹 Supprimer un événement
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      tap(() => this.showMessage('🗑️ Event deleted successfully!'))
    );
  }

  // 🔹 Récupérer caméras et utilisateurs
  getCameras(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlCamera);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlUser);
  }
}