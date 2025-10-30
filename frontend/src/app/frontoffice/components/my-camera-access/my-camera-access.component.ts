import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontofficeAccessService, CameraAccess } from '../../services/frontoffice-access.service';

@Component({
  selector: 'app-my-camera-access',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-camera-access.component.html'
})
export class MyCameraAccessComponent implements OnInit {
  cameraAccesses: CameraAccess[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private accessService: FrontofficeAccessService) {}

  ngOnInit(): void {
    this.loadMyCameraAccess();
  }

  loadMyCameraAccess(): void {
    this.accessService.getMyCameraAccess().subscribe({
      next: (accesses) => {
        this.cameraAccesses = accesses;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  getPermissionLabel(permission: string): string {
    const labels: { [key: string]: string } = {
      'view_live': 'Visionnage Live',
      'view_history': 'Visionnage Historique',
      'manage_alerts': 'Gestion Alertes',
      'full_control': 'Contrôle Total'
    };
    return labels[permission] || permission;
  }

  isAccessActive(access: CameraAccess): boolean {
    if (!access.is_active) return false;
    if (access.expires_at) {
      return new Date(access.expires_at) > new Date();
    }
    return true;
  }
}