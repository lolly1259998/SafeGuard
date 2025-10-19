import { Routes } from '@angular/router';

export const routes: Routes = [
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
];
