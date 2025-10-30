import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { RouterModule } from '@angular/router';

import { FrontControlCentersComponent } from './front-control-centers/front-control-centers.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FrontofficeRoutingModule
  ]
    FrontofficeRoutingModule,
    HttpClientModule,
    FrontControlCentersComponent,
  ],
})
export class FrontofficeModule {}
