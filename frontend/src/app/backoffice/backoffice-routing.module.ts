import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ControlCenterComponent } from './control-center/control-center.component';
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
        component: ControlCenterComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficeRoutingModule {}
