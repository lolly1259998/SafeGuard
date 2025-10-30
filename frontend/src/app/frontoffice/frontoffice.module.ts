// src/app/frontoffice/frontoffice.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FrontofficeRoutingModule } from './frontoffice-routing.module';

import { MainComponent } from './main/main.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FrontofficeRoutingModule,
    MainComponent   // ← Standalone
  ]
})
export class FrontofficeModule {}