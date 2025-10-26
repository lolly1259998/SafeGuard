import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { ListComponent } from './components/scenarios/list/list.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BackofficeRoutingModule,
    RouterModule,
    ListComponent

  ],
})
export class BackofficeModule {}
