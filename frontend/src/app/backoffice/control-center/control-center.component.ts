import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ControlCenter {
  id: number;
  name: string;
  location: string;
  description: string;
  owner: string;
  is_active: boolean;
  created_at: Date;
}

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
  styleUrls: ['./control-center.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ControlCenterComponent {
  newCenter: Partial<ControlCenter> = {
    name: '',
    location: '',
    description: '',
    owner: 'Admin', // exemple par défaut
    is_active: true,
    created_at: new Date(),
  };

  controlCenters: ControlCenter[] = [];

  addCenter() {
    if (!this.newCenter.name) return;
    const id =
      this.controlCenters.length > 0
        ? Math.max(...this.controlCenters.map((c) => c.id)) + 1
        : 1;

    const center: ControlCenter = {
      id,
      name: this.newCenter.name!,
      location: this.newCenter.location || '',
      description: this.newCenter.description || '',
      owner: this.newCenter.owner || 'Admin',
      is_active: this.newCenter.is_active ?? true,
      created_at: new Date(),
    };

    this.controlCenters.push(center);

    // reset formulaire
    this.newCenter = {
      name: '',
      location: '',
      description: '',
      owner: 'Admin',
      is_active: true,
      created_at: new Date(),
    };
  }

  deleteCenter(id: number) {
    this.controlCenters = this.controlCenters.filter((cc) => cc.id !== id);
  }
}
