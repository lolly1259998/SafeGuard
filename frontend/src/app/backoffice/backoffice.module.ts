import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ControlCenterComponent } from './control-center/control-center.component';
import { FormsModule } from '@angular/forms';
import { AiPerformanceDashboardComponent } from './control-center/ai-performance-dashboard/ai-performance-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    DashboardComponent,
    ControlCenterComponent,
    AiPerformanceDashboardComponent,
  ],
})
export class BackofficeModule {}
