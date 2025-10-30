import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  // === Frontoffice ===
  {
    path: '',
    loadChildren: () =>
      import('./backoffice/backoffice.module').then((m) => m.BackofficeModule),
  },

  {
    path: 'frontoffice',
    loadChildren: () =>
      import('./frontoffice/frontoffice.module').then(
        (m) => m.FrontofficeModule
      ),
  },

  // === Backoffice ===
  {
    path: 'backoffice',
    loadChildren: () =>
      import('./backoffice/backoffice.module').then(
        (m) => m.BackofficeModule
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
