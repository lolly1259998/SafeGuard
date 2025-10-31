// src/app/frontoffice/control-center-front.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ControlCenter {
  id?: number;
  name: string;
  location?: string;
  description?: string;
  owner?: number;
  is_active?: boolean;
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ControlCenterFrontService {
  private apiUrl = 'http://127.0.0.1:8000/api/controlcenters/'; // ton endpoint Django

  constructor(private http: HttpClient) {}

  getAll(): Observable<ControlCenter[]> {
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
        console.error('Error loading control centers:', error);
        return throwError(() => error);
      })
    );
  }
}
