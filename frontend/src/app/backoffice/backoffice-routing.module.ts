import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CameraAccessListComponent } from './components/camera-access-list/camera-access-list.component';
import { ControlCenterAccessListComponent } from './components/control-center-access-list/control-center-access-list.component';
import { CameraListComponent } from './components/camera-list/camera-list.component';
import { AiPerformanceDashboardComponent } from './control-center/ai-performance-dashboard/ai-performance-dashboard.component';
import { ControlCenterComponent } from './control-center/control-center.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      // === Routes enfants ===
      { path: 'camera-access', component: CameraAccessListComponent },
      { path: 'control-center-access', component: ControlCenterAccessListComponent },
      { path: 'cameras', component: CameraListComponent },
      { path: 'control-center', component: ControlCenterComponent },
      { path: 'ai-control-centers', component: AiPerformanceDashboardComponent },

      // Redirection par défaut
      { path: '', redirectTo: 'cameras', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficeRoutingModule {}