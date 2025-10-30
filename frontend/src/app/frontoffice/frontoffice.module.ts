import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { FrontControlCentersComponent } from './front-control-centers/front-control-centers.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FrontofficeRoutingModule,
    FrontControlCentersComponent,
  ],
})
export class FrontofficeModule {}
