import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirWaybills } from './air-waybills';

describe('AirWaybills', () => {
  let component: AirWaybills;
  let fixture: ComponentFixture<AirWaybills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirWaybills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirWaybills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
