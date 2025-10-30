import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { FrontControlCentersComponent } from './front-control-centers/front-control-centers.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'control-centers',
    component: FrontControlCentersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontofficeRoutingModule {}
