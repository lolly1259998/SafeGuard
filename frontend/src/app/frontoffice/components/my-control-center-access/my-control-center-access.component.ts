import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontofficeAccessService, ControlCenterAccess } from '../../services/frontoffice-access.service';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-my-control-center-access',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './my-control-center-access.component.html'
})
export class MyControlCenterAccessComponent implements OnInit {
  centerAccesses: ControlCenterAccess[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private accessService: FrontofficeAccessService) {}

  ngOnInit(): void {
    this.loadMyCenterAccess();
  }

  loadMyCenterAccess(): void {
    this.accessService.getMyControlCenterAccess().subscribe({
      next: (accesses) => {
        this.centerAccesses = accesses;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  getAccessLevelLabel(level: string): string {
    const labels: { [key: string]: string } = {
      'viewer': 'Visionneur',
      'operator': 'Opérateur',
      'admin': 'Administrateur',
      'full': 'Complet'
    };
    return labels[level] || level;
  }

  isAccessActive(access: ControlCenterAccess): boolean {
    return !!access.is_active;
  }
}