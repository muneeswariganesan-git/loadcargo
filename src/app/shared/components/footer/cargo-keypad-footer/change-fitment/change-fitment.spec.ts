import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeFitment } from './change-fitment';

describe('ChangeFitment', () => {
  let component: ChangeFitment;
  let fixture: ComponentFixture<ChangeFitment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeFitment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeFitment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
