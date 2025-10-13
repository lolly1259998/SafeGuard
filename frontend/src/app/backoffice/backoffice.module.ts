import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ControlCenterComponent } from './control-center/control-center.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent, ControlCenterComponent],
  imports: [CommonModule, BackofficeRoutingModule, FormsModule],
})
export class BackofficeModule {}
