import { Routes } from '@angular/router';
import { Home } from './features/home/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: ':product',
    loadComponent: () =>
      import('./features/products/components/product-landing/product-landing').then(
        (m) => m.ProductLanding
      ),
  },
];
