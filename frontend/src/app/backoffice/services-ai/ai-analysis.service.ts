import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AIPrediction {
  suspicious: boolean;
  confidence: number;
  risk_level: string;
  model_accuracy: number | string;
  recommendation?: string;
  error?: string;
}

export interface AccessAnalysis {
  access_id: number;
  prediction?: AIPrediction;
  is_analyzing?: boolean;
  last_analyzed?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AiAnalysisService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  analyzeAccess(accessData: any): Observable<AIPrediction> {
    return this.http.post<AIPrediction>(`${this.apiUrl}/ai/access/`, accessData);
  }

  trainModel(): Observable<any> {
    return this.http.post(`${this.apiUrl}/ai/train/`, {});
  }

  getModelInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ai/model-info/`);
  }
}