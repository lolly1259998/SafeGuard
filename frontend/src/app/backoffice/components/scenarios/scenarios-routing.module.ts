import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AiPerformanceDashboardComponent } from './ai-performance-dashboard/ai-performance-dashboard.component';  // Nouveau import

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'ai-dashboard', component: AiPerformanceDashboardComponent }  // Nouvelle route pour dashboard IA
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScenariosRoutingModule { }