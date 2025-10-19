import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,    LayoutComponent,
    SidebarComponent,

    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BackofficeRoutingModule
  ]
})
export class BackofficeModule { }
