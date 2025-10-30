import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  showHomeContent = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showHomeContent = !event.urlAfterRedirects.includes('/cameras');
      });
    
    // Vérifier la route initiale
    this.showHomeContent = !this.router.url.includes('/cameras');
  }
}
  styleUrl: './main.component.css',
})
export class MainComponent {}
