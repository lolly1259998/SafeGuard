import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./backoffice/backoffice.module').then((m) => m.BackofficeModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./frontoffice/frontoffice.module').then(
        (m) => m.FrontofficeModule
      ),
  },
];
