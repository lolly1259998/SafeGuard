// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  // === FRONTOFFICE ===
  {
    path: 'frontoffice',
    loadChildren: () =>
      import('./frontoffice/frontoffice.module').then(m => m.FrontofficeModule),
  },

  // === BACKOFFICE ===
  {
    path: 'backoffice',
    loadChildren: () =>
      import('./backoffice/backoffice.module').then(m => m.BackofficeModule),
  },

  // === DEFAULT ===
  { path: '', redirectTo: 'frontoffice', pathMatch: 'full' },
  { path: '**', redirectTo: 'frontoffice' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}