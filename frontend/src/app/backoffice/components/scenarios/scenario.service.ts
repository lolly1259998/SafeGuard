import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SecurityScenario, ScenarioForm } from './types';
import { catchError, tap } from 'rxjs/operators';

const API_URL = 'http://127.0.0.1:8000/api/securityscenarios/';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<SecurityScenario[]> {
    return this.http.get<SecurityScenario[]>(API_URL);
  }

  create(scenario: ScenarioForm): Observable<SecurityScenario> {
    return this.http.post<SecurityScenario>(API_URL, scenario).pipe(
      tap((response) => console.log('POST Success:', response)),
      catchError((err) => {
        console.error('POST Error:', err);
        return throwError(() => err);
      })
    );
  }
  update(id: number, scenario: Partial<ScenarioForm>): Observable<SecurityScenario> {
    return this.http.put<SecurityScenario>(`${API_URL}${id}/`, scenario);
  }

  // FIXED: Add toggleActive method (PATCH is_active)
  toggleActive(id: number, active: boolean): Observable<SecurityScenario> {
    return this.update(id, { is_active: active });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}${id}/`);
  }
}