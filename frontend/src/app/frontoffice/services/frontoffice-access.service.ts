import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CameraAccess {
  id?: number;
  user: number;
  user_username?: string;
  camera: number;
  camera_name?: string;
  permission: string;
  granted_at?: string;
  expires_at?: string;
  is_active?: boolean;
}

export interface ControlCenterAccess {
  id?: number;
  user: number;
  user_username?: string;
  control_center: number;
  control_center_name?: string;
  access_level: string;
  granted_at?: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FrontofficeAccessService {
  private readonly base = 'http://127.0.0.1:8000/api'; // OK

  constructor(private http: HttpClient) {}

  // CHANGEMENT ICI
  getMyCameraAccess(): Observable<CameraAccess[]> {
    return this.http
      .get<CameraAccess[]>(`${this.base}/cameraaccess/`)  // ← CORRECT
      .pipe(catchError(this.handleError));
  }

  getMyControlCenterAccess(): Observable<ControlCenterAccess[]> {
    return this.http
      .get<ControlCenterAccess[]>(`${this.base}/centeraccess/`)  // ← CORRECT
      .pipe(catchError(this.handleError));
  }

  // handleError reste inchangé
  private handleError(error: HttpErrorResponse) {
    let message = 'Erreur serveur';
    if (error.status === 0) {
      message = 'Serveur injoignable';
    } else if (error.error?.detail) {
      message = error.error.detail;
    }
    return throwError(() => new Error(message));
  }
}