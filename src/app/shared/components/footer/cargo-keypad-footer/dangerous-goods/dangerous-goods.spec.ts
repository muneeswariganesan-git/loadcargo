import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DangerousGoods } from './dangerous-goods';

describe('DangerousGoods', () => {
  let component: DangerousGoods;
  let fixture: ComponentFixture<DangerousGoods>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DangerousGoods]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DangerousGoods);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
