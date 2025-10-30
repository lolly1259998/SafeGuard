// src/app/frontoffice/main/main.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet ,RouterModule, Router, NavigationEnd} from '@angular/router'; // ← AJOUTÉ
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { filter } from 'rxjs/operators';




@Component({
  selector: 'app-main',
  standalone: true,

  imports: [CommonModule,
     RouterModule,
     NavbarComponent,
  
    ],
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
    this.showHomeContent = !this.router.url.includes('/cameras');
  }
}
