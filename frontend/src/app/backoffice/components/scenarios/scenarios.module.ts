import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScenariosRoutingModule } from './scenarios-routing.module';
import { ListComponent } from './list/list.component';  // FIXED: Import standalone component

@NgModule({
  // FIXED: No declarations (standalone components don't need it)
  imports: [
    CommonModule,
    ScenariosRoutingModule,
    ListComponent  // FIXED: Import here instead of declarations
  ]
})
export class ScenariosModule { }