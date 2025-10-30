// src/app/frontoffice/frontoffice-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component.spec';

const routes: Routes = [
  { path: '', component: MainComponent },  // http://localhost:4200/frontoffice

  //Frontoffice Scenarios
  {
    path: 'scenarios',
    loadChildren: () =>
      import('./scenarios/scenarios.module').then(m => m.ScenariosModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule {}