import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  // === Frontoffice ===
  {
    path: '',
    loadChildren: () =>
      import('./frontoffice/frontoffice.module').then(
        (m) => m.FrontofficeModule
      ),
  },

  // === Backoffice ===
  {
    path: 'backoffice',
    loadChildren: () =>
      import('./backoffice/backoffice-routing.module').then(
        (m) => m.BackofficeRoutingModule
      ),
  },

  // === Redirection par défaut ===
  { path: '**', redirectTo: 'backoffice', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
