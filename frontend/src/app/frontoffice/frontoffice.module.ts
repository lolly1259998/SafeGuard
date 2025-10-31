// src/app/frontoffice/frontoffice.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { EventFrontComponent } from './event-front/event-front.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { FrontControlCentersComponent } from './front-control-centers/front-control-centers.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FrontofficeRoutingModule,
    MainComponent,
    EventFrontComponent,
    RouterModule,NavbarComponent,    FrontControlCentersComponent,


  ],
})
export class FrontofficeModule {}
