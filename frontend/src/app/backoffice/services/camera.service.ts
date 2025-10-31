import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Camera {
  id?: number;
  name: string;
  location?: string;
  stream_url: string;
  status?: 'online' | 'offline' | 'maintenance';
  owner?: number;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class CameraService {
  private readonly base = 'http://127.0.0.1:8000/api/cameras/';

  constructor(private http: HttpClient) {}

  list(): Observable<Camera[]> {
    return this.http.get<any>(this.base).pipe(
      catchError(this.handleError),
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
      })
    );
  }

  get(id: number): Observable<Camera> {
    return this.http.get<Camera>(`${this.base}${id}/`).pipe(catchError(this.handleError));
  }

  create(payload: Partial<Camera>): Observable<Camera> {
    return this.http.post<Camera>(this.base, payload).pipe(catchError(this.handleError));
  }

  update(id: number, payload: Partial<Camera>): Observable<Camera> {
    return this.http.put<Camera>(`${this.base}${id}/`, payload).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}${id}/`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Erreur serveur';
    if (error.status === 0) message = 'Serveur injoignable (backend non lancé ?)';
    else if (error.error?.detail) message = error.error.detail;
    else if (error.message) message = error.message;
    return throwError(() => new Error(message));
  }
}
