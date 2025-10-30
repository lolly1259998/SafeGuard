import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MyCameraAccessComponent } from './components/my-camera-access/my-camera-access.component';
import { MyControlCenterAccessComponent } from './components/my-control-center-access/my-control-center-access.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'my-cameras-access', component: MyCameraAccessComponent },
      { path: 'my-centers-access', component: MyControlCenterAccessComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontofficeRoutingModule {}
