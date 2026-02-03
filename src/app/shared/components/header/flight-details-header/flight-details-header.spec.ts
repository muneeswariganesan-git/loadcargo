import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDetailsHeader } from './flight-details-header';

describe('FlightDetailsHeader', () => {
  let component: FlightDetailsHeader;
  let fixture: ComponentFixture<FlightDetailsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDetailsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightDetailsHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
