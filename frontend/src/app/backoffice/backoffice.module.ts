import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BackofficeRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

  ],
})
export class BackofficeModule {}
