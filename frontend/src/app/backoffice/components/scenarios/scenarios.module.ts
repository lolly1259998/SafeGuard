import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // Assure-toi que c'est importé (via ScenariosRoutingModule)
import { ScenariosRoutingModule } from './scenarios-routing.module';
import { ListComponent } from './list/list.component';
import { AiPerformanceDashboardComponent } from './ai-performance-dashboard/ai-performance-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,  // Ajout explicite si erreur binding
    ScenariosRoutingModule,
    ListComponent,
    AiPerformanceDashboardComponent
  ]
})
export class ScenariosModule { }