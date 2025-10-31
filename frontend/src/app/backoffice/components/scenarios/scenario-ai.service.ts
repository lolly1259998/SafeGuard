import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioAIService {
  private BASE_URL = 'http://localhost:8000/api';  // Ton Django

  constructor(private http: HttpClient) {}

  analyzeScenarioPerformance(scenarioId: number): Observable<any> {
    return this.http.post(`${this.BASE_URL}/securityscenarios/${scenarioId}/ai_analysis/`, {});
  }
}