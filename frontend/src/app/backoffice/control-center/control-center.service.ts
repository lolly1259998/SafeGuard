import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Interface du modèle ControlCenter
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
  private apiUrl = 'http://127.0.0.1:8000/api/controlcenters/'; // ton endpoint Django REST

  constructor(private http: HttpClient) {}

  getAll(): Observable<ControlCenter[]> {
    return this.http.get<ControlCenter[]>(this.apiUrl);
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
