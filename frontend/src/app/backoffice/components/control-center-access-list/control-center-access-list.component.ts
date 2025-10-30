import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccessService, ControlCenterAccess } from '../../services/access.service.ts.service';

@Component({
  selector: 'app-control-center-access-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './control-center-access-list.component.html',
  styleUrls: ['./control-center-access-list.component.css']
})
export class ControlCenterAccessListComponent implements OnInit {
  accesses: ControlCenterAccess[] = [];
  users: { id: number; username: string }[] = [];
  centers: { id: number; name: string }[] = [];
  editing: ControlCenterAccess | null = null;

  newAccess: Partial<ControlCenterAccess> = {
    user: undefined,
    control_center: undefined,
    access_level: 'view_only',
    is_active: true,
    granted_by: 1
  };

  constructor(private accessService: AccessService) {}

  ngOnInit(): void {
    this.reload();
    this.accessService.getControlCenters().subscribe({
      next: c => (this.centers = c),
      error: e => console.error('Erreur chargement centres', e)
    });
    this.accessService.getUsers().subscribe({
      next: u => (this.users = u),
      error: e => console.error('Erreur chargement users', e)
    });
  }

  reload(): void {
    this.accessService.getControlCenterAccess().subscribe({
      next: data => (this.accesses = data),
      error: e => console.error('Erreur chargement accès', e)
    });
  }

  add(): void {
    if (!this.newAccess.user || !this.newAccess.control_center) {
      alert('Veuillez sélectionner un utilisateur et un centre de contrôle.');
      return;
    }

    this.accessService.addControlCenterAccess(this.newAccess).subscribe({
      next: res => {
        this.accesses.push(res);
        this.newAccess = {
          access_level: 'view_only',
          is_active: true,
          granted_by: 1
        };
      },
      error: err => console.error('Erreur ajout', err)
    });
  }

  startEdit(a: ControlCenterAccess) {
    this.editing = { ...a };
  }

  saveEdit() {
    if (!this.editing?.id) return;
    this.accessService.updateControlCenterAccess(this.editing.id, this.editing).subscribe({
      next: res => {
        const i = this.accesses.findIndex(x => x.id === res.id);
        if (i > -1) this.accesses[i] = res;
        this.editing = null;
      },
      error: err => console.error('Erreur mise à jour', err)
    });
  }

  delete(id?: number) {
    if (!id) return;
    if (!confirm('Confirmer la suppression ?')) return;
    this.accessService.deleteControlCenterAccess(id).subscribe({
      next: () => this.accesses = this.accesses.filter(a => a.id !== id),
      error: err => console.error('Erreur suppression', err)
    });
  }
}
