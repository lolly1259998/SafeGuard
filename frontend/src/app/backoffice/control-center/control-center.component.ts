import { Component } from '@angular/core';
import { ControlCenterService, ControlCenter } from '../control-center.service';
@Component({
  selector: 'app-control-center',
  imports: [],
  templateUrl: './control-center.component.html',
  styleUrl: './control-center.component.css',
})
export class ControlCenterComponent {
  controlCenters: ControlCenter[] = [];
  newCenter: Partial<ControlCenter> = {};
  constructor(private service: ControlCenterService) {}
  ngOnInit() {
    this.loadCenters();
  }

  loadCenters() {
    this.service.getAll().subscribe((data) => (this.controlCenters = data));
  }

  addCenter() {
    this.service.create(this.newCenter).subscribe(() => {
      this.loadCenters();
      this.newCenter = {};
    });
  }

  deleteCenter(id: number) {
    this.service.delete(id).subscribe(() => this.loadCenters());
  }
}
