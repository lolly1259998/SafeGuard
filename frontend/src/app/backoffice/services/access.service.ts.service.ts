// src/app/services/access.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// ==================== INTERFACES ====================

// Accès aux caméras
export interface CameraAccess {
  id?: number;
  user: number;
  user_username?: string;
  camera: number;
  camera_name?: string;
  permission: string;
  granted_by?: number;
  granted_by_username?: string;
  granted_at?: string;
  expires_at?: string;
  is_active?: boolean;
}

// Accès aux centres de contrôle
export interface ControlCenterAccess {
  id?: number;
  user: number;
  user_username?: string;
  control_center: number;
  control_center_name?: string;
  access_level: string;
  granted_by?: number;
  granted_by_username?: string;
  granted_at?: string;
  is_active?: boolean;
}

// ==================== SERVICE ====================

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private readonly base = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // ---------- CAMERAS ----------
  getCameraAccess(): Observable<CameraAccess[]> {
    return this.http
      .get<any>(`${this.base}/cameraaccess/`)
      .pipe(
        catchError(this.handleError),
        map((response: any) => {
          // Gérer la pagination Django REST Framework ou réponse directe
          if (Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.results)) {
            return response.results;
          } else if (response && typeof response === 'object') {
            // Si c'est un objet unique, le convertir en tableau
            return [response];
          }
          return [];
        })
      );
  }

  addCameraAccess(payload: Partial<CameraAccess>): Observable<CameraAccess> {
    return this.http
      .post<CameraAccess>(`${this.base}/cameraaccess/`, payload)
      .pipe(catchError(this.handleError));
  }

  updateCameraAccess(id: number, payload: Partial<CameraAccess>): Observable<CameraAccess> {
    return this.http
      .put<CameraAccess>(`${this.base}/cameraaccess/${id}/`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteCameraAccess(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/cameraaccess/${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ---------- CONTROL CENTERS ----------
  getControlCenterAccess(): Observable<ControlCenterAccess[]> {
    return this.http
      .get<any>(`${this.base}/centeraccess/`)
      .pipe(
        catchError(this.handleError),
        map((response: any) => {
          if (Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.results)) {
            return response.results;
          } else if (response && typeof response === 'object') {
            return [response];
          }
          return [];
        })
      );
  }

  addControlCenterAccess(payload: Partial<ControlCenterAccess>): Observable<ControlCenterAccess> {
    return this.http
      .post<ControlCenterAccess>(`${this.base}/centeraccess/`, payload)
      .pipe(catchError(this.handleError));
  }

  updateControlCenterAccess(id: number, payload: Partial<ControlCenterAccess>): Observable<ControlCenterAccess> {
    return this.http
      .put<ControlCenterAccess>(`${this.base}/centeraccess/${id}/`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteControlCenterAccess(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/centeraccess/${id}/`)
      .pipe(catchError(this.handleError));
  }

  // ---------- LISTES ----------
  getUsers(): Observable<{ id: number; username: string }[]> {
    return this.http
      .get<any>(`${this.base}/users/`)
      .pipe(
        catchError(this.handleError),
        map((response: any) => {
          if (Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.results)) {
            return response.results;
          } else if (response && typeof response === 'object') {
            return [response];
          }
          return [];
        })
      );
  }

  getCameras(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<any>(`${this.base}/cameras/`)
      .pipe(
        catchError(this.handleError),
        map((response: any) => {
          if (Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.results)) {
            return response.results;
          } else if (response && typeof response === 'object') {
            return [response];
          }
          return [];
        })
      );
  }

  getControlCenters(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<any>(`${this.base}/controlcenters/`)
      .pipe(
        catchError(this.handleError),
        map((response: any) => {
          if (Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.results)) {
            return response.results;
          } else if (response && typeof response === 'object') {
            return [response];
          }
          return [];
        })
      );
  }

  // ---------- GESTION DES ERREURS ----------
  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API:', error);

    let message = 'Erreur serveur';
    if (error.status === 0) {
      message = 'Serveur injoignable (backend non lancé ?)';
    } else if (error.error?.detail) {
      message = error.error.detail;
    } else if (error.message) {
      message = error.message;
    }

    return throwError(() => new Error(message));
  }
}
