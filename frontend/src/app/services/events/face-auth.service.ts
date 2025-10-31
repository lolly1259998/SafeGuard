// frontend/src/app/face-auth/face-auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceAuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/face/recognize/';

  constructor(private http: HttpClient) {}

  recognize(photo: File): Observable<any> {
    const form = new FormData();
    form.append('photo', photo);
    return this.http.post(this.apiUrl, form);
  }
}