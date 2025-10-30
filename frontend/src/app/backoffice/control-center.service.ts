import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ControlCenter {
  id: number;
  name: string;
  location?: string;
  description?: string;
  owner: number;
  is_active: boolean;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ControlCenterService {
  private apiUrl = '/api/controlcenters/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ControlCenter[]> {
    return this.http.get<ControlCenter[]>(this.apiUrl);
  }

  get(id: number): Observable<ControlCenter> {
    return this.http.get<ControlCenter>(`${this.apiUrl}${id}/`);
  }

  create(data: Partial<ControlCenter>): Observable<ControlCenter> {
    return this.http.post<ControlCenter>(this.apiUrl, data);
  }

  update(id: number, data: Partial<ControlCenter>): Observable<ControlCenter> {
    return this.http.put<ControlCenter>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
