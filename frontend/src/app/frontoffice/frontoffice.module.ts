import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FrontofficeRoutingModule
  ]
})
export class FrontofficeModule { }