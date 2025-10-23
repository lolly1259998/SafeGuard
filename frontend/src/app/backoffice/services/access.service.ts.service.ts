// src/app/services/access.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
      .get<CameraAccess[]>(`${this.base}/cameraaccess/`)
      .pipe(catchError(this.handleError));
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
      .get<ControlCenterAccess[]>(`${this.base}/centeraccess/`)
      .pipe(catchError(this.handleError));
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
      .get<{ id: number; username: string }[]>(`${this.base}/users/`)
      .pipe(catchError(this.handleError));
  }

  getCameras(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<{ id: number; name: string }[]>(`${this.base}/cameras/`)
      .pipe(catchError(this.handleError));
  }

  getControlCenters(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<{ id: number; name: string }[]>(`${this.base}/controlcenters/`)
      .pipe(catchError(this.handleError));
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
