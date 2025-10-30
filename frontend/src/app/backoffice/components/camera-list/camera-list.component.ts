import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Camera, CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.css'],
})
export class CameraListComponent implements OnInit {
  cameras: Camera[] = [];
  form!: FormGroup;
  editingId: number | null = null;
  loading = false;
  error = '';

  // Filters
  filterText = '';
  filterStatus: '' | 'online' | 'offline' | 'maintenance' = '';

  constructor(private fb: FormBuilder, private cameraService: CameraService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      location: [''],
      stream_url: ['', [Validators.required]],
      status: ['offline'],
    });
    this.fetch();
  }

  get filteredCameras(): Camera[] {
    const text = this.filterText.trim().toLowerCase();
    const status = this.filterStatus;
    return this.cameras.filter((c) => {
      const matchesText = !text ||
        c.name.toLowerCase().includes(text) ||
        (c.location || '').toLowerCase().includes(text) ||
        (c.stream_url || '').toLowerCase().includes(text);
      const matchesStatus = !status || c.status === status;
      return matchesText && matchesStatus;
    });
  }

  fetch() {
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

  submit() {
    if (this.form.invalid) return;
    const payload = this.form.value as Partial<Camera>;

    if (this.editingId) {
      this.cameraService.update(this.editingId, payload).subscribe({
        next: () => {
          this.cancelEdit();
          this.fetch();
        },
        error: (err) => (this.error = err.message),
      });
    } else {
      this.cameraService.create(payload).subscribe({
        next: () => {
          this.form.reset({ status: 'offline' });
          this.fetch();
        },
        error: (err) => (this.error = err.message),
      });
    }
  }

  edit(cam: Camera) {
    this.editingId = cam.id ?? null;
    this.form.patchValue({
      name: cam.name,
      location: cam.location || '',
      stream_url: cam.stream_url,
      status: cam.status || 'offline',
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ status: 'offline' });
  }

  delete(cam: Camera) {
    if (!cam.id) return;
    if (!confirm(`Supprimer la caméra "${cam.name}" ?`)) return;
    this.cameraService.delete(cam.id).subscribe({
      next: () => this.fetch(),
      error: (err) => (this.error = err.message),
    });
  }
}
