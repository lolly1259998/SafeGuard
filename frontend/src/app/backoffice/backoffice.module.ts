import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ControlCenterComponent } from './control-center/control-center.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AiPerformanceDashboardComponent } from './control-center/ai-performance-dashboard/ai-performance-dashboard.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    FormsModule,
    DashboardComponent,
    ControlCenterComponent,
    HttpClientModule,
    AiPerformanceDashboardComponent,
  ],
})
export class BackofficeModule {}
