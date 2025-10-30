import { Routes } from '@angular/router';

export const routes: Routes = [
  // === Frontoffice ===
  {
    path: 'front',
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
  { path: '', redirectTo: 'front', pathMatch: 'full' },
  { path: '**', redirectTo: 'front', pathMatch: 'full' },
];
