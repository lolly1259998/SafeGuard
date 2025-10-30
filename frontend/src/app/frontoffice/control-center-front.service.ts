// src/app/frontoffice/control-center-front.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.get<ControlCenter[]>(this.apiUrl);
  }
}
