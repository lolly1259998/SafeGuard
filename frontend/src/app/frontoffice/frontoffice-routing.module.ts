import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { EventFrontComponent } from './event-front/event-front.component';
import { FoCameraListComponent } from './components/camera-list/camera-list.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { FrontControlCentersComponent } from './front-control-centers/front-control-centers.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'cameras', pathMatch: 'full' }
    ]
  },
  {
    path: 'control-centersFront',
    component: FrontControlCentersComponent,
  },
  { 
    path: 'eventsFront', 
    component: EventFrontComponent },
    { path: 'camerasFront', component: FoCameraListComponent },
    { path: 'camerasFront/:id/play', component: VideoPlayerComponent },



  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontofficeRoutingModule {}
