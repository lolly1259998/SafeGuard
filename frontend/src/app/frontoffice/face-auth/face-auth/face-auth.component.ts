import { Component } from '@angular/core';
import { FaceAuthService } from '../../../services/events/face-auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-face-auth',  standalone: true,

  imports: [FormsModule,CommonModule, RouterModule],
  templateUrl: './face-auth.component.html',
  styleUrl: './face-auth.component.css'
})
export class FaceAuthComponent {
file: File | null = null;
  result: any = null;
  loading = false;

  constructor(private service: FaceAuthService) {}

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  verify() {
    if (!this.file) return alert("Choisis une photo");

    this.loading = true;
    this.service.recognize(this.file).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: () => {
        this.result = { message: "Erreur serveur", authorized: false };
        this.loading = false;
      }
    });
  }
}

