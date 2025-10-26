import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { EventFrontComponent } from './event-front/event-front.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    FrontofficeRoutingModule,
    EventFrontComponent,
    RouterModule,NavbarComponent,

  ]
})
export class FrontofficeModule { }
