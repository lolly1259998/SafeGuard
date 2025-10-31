import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlCenterService, ControlCenter } from './control-center.service'; // ✅ import du service

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
  styleUrls: ['./control-center.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ControlCenterComponent implements OnInit {
  controlCenters: ControlCenter[] = [];
  showAddForm: boolean = false;
  editing: boolean = false;
  newCenter: Partial<ControlCenter> = {
    name: '',
    location: '',
    description: '',
    owner: '',
    is_active: true,
  };

  constructor(private service: ControlCenterService) {}

  ngOnInit() {
    this.loadCenters();
  }

  loadCenters() {
    this.service.getAll().subscribe({
      next: (data) => {
        // Protection: s'assurer que data est toujours un tableau
        this.controlCenters = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Error loading control centers:', err);
        this.controlCenters = [];
      }
    });
  }

  addOrUpdateCenter() {
    if (!this.newCenter.name) return;

    if (this.editing && this.newCenter.id) {
      this.service
        .update(this.newCenter as ControlCenter)
        .subscribe((updated) => {
          const index = this.controlCenters.findIndex(
            (c) => c.id === updated.id
          );
          if (index !== -1) this.controlCenters[index] = updated;
        });
      this.editing = false;
    } else {
      this.service.add(this.newCenter).subscribe((created) => {
        this.controlCenters.push(created);
      });
    }

    this.newCenter = {
      name: '',
      location: '',
      description: '',
      owner: '',
      is_active: true,
    };
    this.showAddForm = false;
  }

  editCenter(center: ControlCenter) {
    this.newCenter = { ...center };
    this.editing = true;
    this.showAddForm = true;
  }

  deleteCenter(id: number) {
    this.service.delete(id).subscribe(() => {
      this.controlCenters = this.controlCenters.filter((c) => c.id !== id);
    });
  }
}
