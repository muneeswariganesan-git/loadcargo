import { Routes } from '@angular/router';
import { MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';
export const routes: Routes = [
  // {
  //   path: 'oauth/callback',
  //   component: MsalRedirectComponent, 
  // },
  {
    path: '',
  //  canActivate: [MsalGuard],
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: ':product',
    loadComponent: () =>
      import('./features/products/components/product-landing/product-landing').then(
        (m) => m.ProductLanding
      ),
  },
];
