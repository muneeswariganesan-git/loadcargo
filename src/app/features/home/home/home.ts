import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { WelcomeHeader } from '../../../shared/components/header/welcome-header/welcome-header';
import { ProductFooter } from '../../../shared/components/footer/product-footer/product-footer';
import { PRODUCT_CONFIG } from '../../../core/config/product-config';


@Component({
  selector: 'app-home',
  imports: [ProductFooter, WelcomeHeader],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  products = PRODUCT_CONFIG;
  router = inject(Router);
//   navigateToProduct(product: any) {
//     if (!product || !product.service) {
//       return;
//     }
//   console.log(product);
  
//  this.router.navigate([
//   product.service.toLowerCase().replace(/\s+/g, '-')
// ]);

    // const route = product.service.toLowerCase();
   
    // this.router.navigate([route]);
  //}

  
navigateToProduct(product: any) {
  if (!product || !product.route) return;
 // this.router.navigate([product.route]);
  this.router.navigate([`/${product.route}`])
}

}
