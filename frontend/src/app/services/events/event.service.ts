import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => {
        // Gérer la pagination Django REST Framework ou réponse directe
        if (Array.isArray(response)) {
          return response;
        } else if (response && Array.isArray(response.results)) {
          return response.results;
        } else if (response && typeof response === 'object') {
          return [response];
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error loading events:', error);
        return throwError(() => error);
      })
    );
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
    return this.http.get<any>(this.apiUrlCamera).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        } else if (response && Array.isArray(response.results)) {
          return response.results;
        } else if (response && typeof response === 'object') {
          return [response];
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error loading cameras:', error);
        return throwError(() => error);
      })
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any>(this.apiUrlUser).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        } else if (response && Array.isArray(response.results)) {
          return response.results;
        } else if (response && typeof response === 'object') {
          return [response];
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error loading users:', error);
        return throwError(() => error);
      })
    );
  }
}