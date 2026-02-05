import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightLegDetailsDialog } from './flight-leg-details-dialog';

describe('FlightLegDetailsDialog', () => {
  let component: FlightLegDetailsDialog;
  let fixture: ComponentFixture<FlightLegDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightLegDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightLegDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
