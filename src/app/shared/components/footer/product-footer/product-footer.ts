import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-footer',
  imports: [CommonModule],
  templateUrl: './product-footer.html',
  styleUrl: './product-footer.css',
})
export class ProductFooter {
  @Input() products: any[] = [];
  @Output() productClick = new EventEmitter<any>();

  selectProduct(product: any) {
    this.productClick.emit(product);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key.startsWith('F')) {
      event.preventDefault();
      const product = this.products.find((p) => p.keypad === event.key);
      if (product) {
        this.selectProduct(product);
      }
    }
  }
}
