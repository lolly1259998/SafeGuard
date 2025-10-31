// src/app/frontoffice/services/scenario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SecurityScenario {
  id: number;
  user_name: string;
  control_center_name: string | null;
  camera_names: string[];
  preview: string;
  name: string;
  apply_to_all_cameras: boolean;
  event_types: string[];
  start_time: string;
  end_time: string;
  days_of_week: number[];
  alert_email: boolean;
  alert_sms: boolean;
  save_recording: boolean;
  priority: string;
  is_active: boolean;
  is_manual: boolean;
  created_at: string;
  updated_at: string;
  user: number;
  control_center: number | null;
  cameras: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  private apiUrl = 'http://127.0.0.1:8000/api/securityscenarios/';

  constructor(private http: HttpClient) {}

  getScenarios(): Observable<SecurityScenario[]> {
    return this.http.get<SecurityScenario[]>(this.apiUrl);
  }

  getScenarioById(id: number): Observable<SecurityScenario> {
    return this.http.get<SecurityScenario>(`${this.apiUrl}${id}/`);
  }
    // New method to update scenario status
  updateScenarioStatus(id: number, is_active: boolean): Observable<SecurityScenario> {
    return this.http.patch<SecurityScenario>(`${this.apiUrl}${id}/`, { is_active });
  }

  // Alternative: If your backend requires PUT instead of PATCH
  updateScenario(id: number, data: Partial<SecurityScenario>): Observable<SecurityScenario> {
    return this.http.put<SecurityScenario>(`${this.apiUrl}${id}/`, data);
  }
}