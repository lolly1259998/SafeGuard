import { Component, OnInit } from '@angular/core';
import {
  ControlCenterFrontService,
  ControlCenter,
} from '../control-center-front.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-front-control-centers',
  templateUrl: './front-control-centers.component.html',
  styleUrls: ['./front-control-centers.component.css'],
  imports: [CommonModule,NavbarComponent],
})
export class FrontControlCentersComponent implements OnInit {
  centers: ControlCenter[] = [];
  selected: ControlCenter | null = null;
  loading = false;
  errorMessage = '';

  constructor(private service: ControlCenterFrontService) {}

  ngOnInit(): void {
    this.loadCenters();
  }

  loadCenters() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        // Protection: s'assurer que data est toujours un tableau
        this.centers = Array.isArray(data) ? data : [];
        this.loading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des centres';
        this.centers = [];
        this.loading = false;
      },
    });
  }

  openDetails(center: ControlCenter) {
    this.selected = center;
  }

  closeDetails() {
    this.selected = null;
  }
}
