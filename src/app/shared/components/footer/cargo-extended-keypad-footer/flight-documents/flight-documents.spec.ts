import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDocuments } from './flight-documents';

describe('FlightDocuments', () => {
  let component: FlightDocuments;
  let fixture: ComponentFixture<FlightDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDocuments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightDocuments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
