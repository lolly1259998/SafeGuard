import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { EventFrontComponent } from './event-front/event-front.component';
import { NavbarComponent } from './navbar/navbar.component';



import { FrontControlCentersComponent } from './front-control-centers/front-control-centers.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FrontofficeRoutingModule,
    FrontControlCentersComponent,  CommonModule,
    FrontofficeRoutingModule,
    EventFrontComponent,
    RouterModule,NavbarComponent
  ],
})
export class FrontofficeModule {}
