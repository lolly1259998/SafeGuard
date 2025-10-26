import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { EventFrontComponent } from './event-front/event-front.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  { 
    path: 'eventsFront', 
    component: EventFrontComponent },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontofficeRoutingModule {}
