import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AiPerformanceDashboardComponent } from './control-center/ai-performance-dashboard/ai-performance-dashboard.component';
const routes: Routes = [
  {
    // /dashboard
    path: '',
    component: DashboardComponent,
    children: [
      /*{
        // /dashboard
         path: '',
        component: ControlCenterComponent,
      },*/
      {
        // /dashboard/controlcenters
        path: 'controlcenters',
        loadComponent: () =>
          import('./control-center/control-center.component').then(
            (m) => m.ControlCenterComponent
          ),
      },
      // AJOUTER CETTE NOUVELLE ROUTE
      {
        path: 'ai-control-centers',
        component: AiPerformanceDashboardComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficeRoutingModule {}
