// src/app/backoffice/backoffice-routing.module.ts (child routes for backoffice)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CameraAccessListComponent } from './components/camera-access-list/camera-access-list.component';
import { ControlCenterAccessListComponent } from './components/control-center-access-list/control-center-access-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'camera-access', component: CameraAccessListComponent },
      { path: 'control-center-access', component: ControlCenterAccessListComponent },
      { path: 'scenarios', loadChildren: () => import('./components/scenarios/scenarios.module').then(m => m.ScenariosModule) },  // FIXED: Lazy-load scenarios
      { path: '', redirectTo: 'camera-access', pathMatch: 'full' },
      { path: '**', redirectTo: 'camera-access' }  // Wildcard last
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficeRoutingModule {}