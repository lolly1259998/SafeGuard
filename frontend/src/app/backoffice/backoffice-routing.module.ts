import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CameraAccessListComponent } from './components/camera-access-list/camera-access-list.component';
import { ControlCenterAccessListComponent } from './components/control-center-access-list/control-center-access-list.component';
import { AiPerformanceDashboardComponent } from './control-center/ai-performance-dashboard/ai-performance-dashboard.component';
import { ControlCenterComponent } from './control-center/control-center.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      // ✅ Redirection par défaut vers "controlcenters"

      // === Liste des routes enfants ===
      { path: 'camera-access', component: CameraAccessListComponent },
      { path: 'control-center', component: ControlCenterComponent },
      /* {
        // /dashboard/controlceers
        path: 'controlcenters',
        loadComponent: () =>
          import('./control-center/control-center.component').then(
            (m) => m.ControlCenterComponent
          ),
      },
*/
      {
        path: 'ai-control-centers',
        component: AiPerformanceDashboardComponent,
      },

      {
        path: 'control-center-access',
        component: ControlCenterAccessListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficeRoutingModule {}
