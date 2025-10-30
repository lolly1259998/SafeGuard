import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ControlCenterAIService {
  // ✅ Utilise /api comme préfixe car Django attend /api/ai/...
  private BASE_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Analyse des performances d'un centre de contrôle
  analyzeControlCenterPerformance(controlCenterId: number): Observable<any> {
    return this.http.post(
      `${this.BASE_URL}/ai/control-centers/${controlCenterId}/performance`,
      {}
    );
  }

  // Recommandations d'optimisation
  getOptimizationRecommendations(controlCenterId: number): Observable<any> {
    return this.http.get(
      `${this.BASE_URL}/ai/control-centers/${controlCenterId}/recommendations`
    );
  }
}
