import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { FoCameraListComponent } from './components/camera-list/camera-list.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { FrontControlCentersComponent } from './front-control-centers/front-control-centers.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'cameras', component: FoCameraListComponent },
      { path: 'cameras/:id/play', component: VideoPlayerComponent },
      { path: '', redirectTo: 'cameras', pathMatch: 'full' }
    ]
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
