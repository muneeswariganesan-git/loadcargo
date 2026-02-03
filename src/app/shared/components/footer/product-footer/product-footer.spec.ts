import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFooter } from './product-footer';

describe('ProductFooter', () => {
  let component: ProductFooter;
  let fixture: ComponentFixture<ProductFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
