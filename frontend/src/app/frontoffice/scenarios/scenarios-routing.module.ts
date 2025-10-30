// src/app/frontoffice/scenarios/scenarios-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScenarioListComponent } from './scenario-list/scenario-list.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';

const routes: Routes = [
  { path: '', component: ScenarioListComponent },
  { path: ':id', component: ScenarioDetailComponent }  // ← NEW
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScenariosRoutingModule {}