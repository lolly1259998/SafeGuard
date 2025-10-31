// src/app/frontoffice/frontoffice-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MyCameraAccessComponent } from './components/my-camera-access/my-camera-access.component';
import { MyControlCenterAccessComponent } from './components/my-control-center-access/my-control-center-access.component';
import { EventFrontComponent } from './event-front/event-front.component';
import { FoCameraListComponent } from './components/camera-list/camera-list.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { FrontControlCentersComponent } from './front-control-centers/front-control-centers.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
    ],
  },
  { 
    path: 'home', 
    component: MainComponent 
  },
  {
    path: 'control-centersFront',
    component: FrontControlCentersComponent,
  },
  { 
    path: 'eventsFront', 
    component: EventFrontComponent 
  },
  { 
    path: 'camerasFront', 
    component: FoCameraListComponent 
  },
  { 
    path: 'camerasFront/:id/play', 
    component: VideoPlayerComponent 
  },
  { 
    path: 'my-cameras-access', 
    component: MyCameraAccessComponent 
  },
  { 
    path: 'my-centers-access', 
    component: MyControlCenterAccessComponent 
  },
  {
    path: 'scenarios',
    loadChildren: () =>
      import('./scenarios/scenarios.module').then(m => m.ScenariosModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule {}
