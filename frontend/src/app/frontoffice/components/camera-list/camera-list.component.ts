import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Camera, CameraService } from '../../../backoffice/services/camera.service';

@Component({
  selector: 'app-fo-camera-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.css'],
})
export class FoCameraListComponent implements OnInit {
  cameras: Camera[] = [];
  loading = false;
  error = '';

  constructor(private cameraService: CameraService) {}

  ngOnInit(): void {
    this.loading = true;
    this.cameraService.list().subscribe({
      next: (data) => {
        this.cameras = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }
}
