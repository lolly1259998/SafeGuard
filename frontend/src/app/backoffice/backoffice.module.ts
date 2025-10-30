import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ControlCenterComponent } from './control-center/control-center.component';
import { AiPerformanceDashboardComponent } from './control-center/ai-performance-dashboard/ai-performance-dashboard.component';
import { HttpClientModule } from '@angular/common/http';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({

  declarations: [
  ],
  imports: [
    CommonModule,    LayoutComponent,
    SidebarComponent,
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BackofficeRoutingModule,
     CommonModule,
    BackofficeRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    DashboardComponent,
    ControlCenterComponent,
    AiPerformanceDashboardComponent,
  ]

})
export class BackofficeModule {}
