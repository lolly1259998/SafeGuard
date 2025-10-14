import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccessService, CameraAccess } from '../../services/access.service.ts.service';

@Component({
  selector: 'app-camera-access-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './camera-access-list.component.html',
  styleUrls: ['./camera-access-list.component.css']
})
export class CameraAccessListComponent implements OnInit {
  accesses: CameraAccess[] = [];
  newAccess: Partial<CameraAccess> = { permission: 'view_live' };
  users: { id: number; username: string }[] = [];
  cameras: { id: number; name: string }[] = [];
  editing: CameraAccess | null = null;

  constructor(private accessService: AccessService) {}

  ngOnInit(): void {
    this.reload();
    this.accessService.getUsers().subscribe(u => (this.users = u));
    this.accessService.getCameras().subscribe(c => (this.cameras = c));
  }

  reload(): void {
    this.accessService.getCameraAccess().subscribe(data => (this.accesses = data));
  }

  add(): void {
    this.accessService.addCameraAccess(this.newAccess).subscribe({
      next: res => {
        this.accesses.push(res);
        this.newAccess = { permission: 'view_live' };
      },
      error: err => console.error('Add error', err)
    });
  }

  startEdit(a: CameraAccess) {
    this.editing = { ...a };
  }

  saveEdit() {
    if (!this.editing?.id) return;
    this.accessService.updateCameraAccess(this.editing.id, this.editing).subscribe({
      next: res => {
        const i = this.accesses.findIndex(x => x.id === res.id);
        if (i > -1) this.accesses[i] = res;
        this.editing = null;
      },
      error: err => console.error('Update error', err)
    });
  }

  delete(id?: number) {
    if (!id) return;
    if (!confirm('Confirmer la suppression ?')) return;
    this.accessService.deleteCameraAccess(id).subscribe({
      next: () => (this.accesses = this.accesses.filter(a => a.id !== id)),
      error: err => console.error('Delete error', err)
    });
  }
}
