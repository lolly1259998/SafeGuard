import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CameraAccessListComponent } from './components/camera-access-list/camera-access-list.component';
import { ControlCenterAccessListComponent } from './components/control-center-access-list/control-center-access-list.component';
import { CameraListComponent } from './components/camera-list/camera-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'camera-access', component: CameraAccessListComponent },
      { path: 'control-center-access', component: ControlCenterAccessListComponent },
      { path: 'cameras', component: CameraListComponent },
      { path: '', redirectTo: 'cameras', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficeRoutingModule {}
