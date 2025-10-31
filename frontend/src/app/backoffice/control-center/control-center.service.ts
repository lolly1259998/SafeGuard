import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface ControlCenter {
  id: number;
  name: string;
  location: string;
  description: string;
  owner: string;
  is_active: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ControlCenterService {
  private apiUrl = 'http://127.0.0.1:8000/api/controlcenters/';

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

  add(center: Partial<ControlCenter>): Observable<ControlCenter> {
    return this.http.post<ControlCenter>(this.apiUrl, center);
  }

  update(center: ControlCenter): Observable<ControlCenter> {
    return this.http.put<ControlCenter>(`${this.apiUrl}${center.id}/`, center);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
