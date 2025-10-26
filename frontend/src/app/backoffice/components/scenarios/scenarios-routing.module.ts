// src/app/backoffice/components/scenarios/scenarios-routing.module.ts (sub-routes for scenarios)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScenariosRoutingModule { }