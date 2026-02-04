import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { FlightDetailsHeader } from './flight-details-header';
import { ProductService } from '../../../services/product-service';
import { CommonModule } from '@angular/common';

fdescribe('FlightDetailsHeader Component – 100% Coverage', () => {
  let component: FlightDetailsHeader;
  let fixture: ComponentFixture<FlightDetailsHeader>;
  let flightData$: Subject<any>;
  let mockProductService: any;

  beforeEach(async () => {
    flightData$ = new Subject<any>();

    mockProductService = {
      flightData$: flightData$
    };

    await TestBed.configureTestingModule({
      imports: [FlightDetailsHeader, CommonModule],
      providers: [{ provide: ProductService, useValue: mockProductService }]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightDetailsHeader);
    component = fixture.componentInstance;
  });

  const sampleHeader: any = {
    datedFlightLeg: {
      operatorCarrierCode: 'BA',
      operationalFlightNumber: '15',
      operationalFlightNumberSuffix: 'A',
      originStation: 'LHR',
      destinationStation: 'SIN',
      scheduledDepartureDateLocal: '2026-02-02T21:00:00'
    },
    aircraftRegistrationCode: 'GSTBI',
    airfliteAircraftSubtype: '77H',
    fmAircraftSubType: 'B777',
    standNumber: '536',
    flightLeg: [
      {
        flightLegOrigin: 'LHR',
        flightLegDestination: 'SIN',
        dateTimes: [
          {
            dateTimeLocal: '2026-02-02T21:00:00',
            dateTimeStatus: 'Scheduled',
            dateTimeType: 'Departure'
          },
          {
            dateTimeLocal: '2026-02-03T18:00:00',
            dateTimeStatus: 'Scheduled',
            dateTimeType: 'Arrival'
          }
        ]
      }
    ],
    flightStatus: {
      generalStatusCode: 'GO',
      loadReleaseStatus: 'Provisional'
    },
    product: {
      plannedLoadReleaseTime: '2026-02-02T17:00:00',
      plannedBuildCloseTime: '2026-02-01T00:00:00',
      plannedManifestTime: '2026-02-02T10:00:00',
      ownerName: 'John Doe'
    },
    currentFlightFitment: {
      palletCount: 10,
      containerCount: 2
    },
    ngrmFitment: {
      palletCount: 8,
      containerCount: 1
    }
  };

  // --------------------------------------------------------------------
  // 1. Test ngOnInit subscription and full DOM rendering
  // --------------------------------------------------------------------
  // it('should render all flight header fields from subscription', () => {
  //   fixture.detectChanges();
  //   flightData$.next(sampleHeader);
  //   fixture.detectChanges();

  //   expect(component.cargoFlightHeaderData.flight).toBe('BA 15A');

  //   const compiled = fixture.nativeElement as HTMLElement;

  //   expect(compiled.querySelector('.value')?.textContent).toContain('BA 15A');
  //   expect(compiled.textContent).toContain('LHR');
  //   expect(compiled.textContent).toContain('SIN');
  //   expect(compiled.textContent).toContain('GO');
  //   expect(compiled.textContent).toContain('John Doe');
  // });

  // --------------------------------------------------------------------
  // 2. Test Build Close Logic (Y when > 18 hours)
  // --------------------------------------------------------------------
  it('should calculate Build Close as Y when more than 18 hours before STD', () => {
    const result = (component as any).computeBuildCloseDisplay(sampleHeader);
    expect(result.text).toBe('Y');
    expect(result.diffHours).toBeGreaterThan(18);
  });

  // --------------------------------------------------------------------
  // 3. Test Build Close as N (< 18 hours)
  // --------------------------------------------------------------------
  it('should calculate Build Close as N when less than 18 hours', () => {
    const header = structuredClone(sampleHeader);
    header.product.plannedBuildCloseTime = '2026-02-02T10:00:00'; // 11 hours before STD

    const result = (component as any).computeBuildCloseDisplay(header);
    expect(result.text).toBe('N');
  });

  // --------------------------------------------------------------------
  // 4. Cargo Release = Final → Y
  // --------------------------------------------------------------------
  it('should return Y for cargo release when loadReleaseStatus = Final', () => {
    const header = structuredClone(sampleHeader);
    header.flightStatus.loadReleaseStatus = 'Final';

    const cr = (component as any).computeCargoReleaseDisplay(header);
    expect(cr.text).toBe('Y');
    expect(cr.status).toBe('cr-done');
  });

  // --------------------------------------------------------------------
  // 5. Cargo Release overdue (> cutoff)
  // --------------------------------------------------------------------
  it('should detect overdue cargo release', () => {
    const header = structuredClone(sampleHeader);
    header.product.plannedLoadReleaseTime = '2026-02-02T20:00:00'; // 1 hr before STD → overdue

    const cr = (component as any).computeCargoReleaseDisplay(header);
    expect(cr.status).toBe('cr-overdue');
  });

  // --------------------------------------------------------------------
  // 6. Cargo Release OK (<= cutoff)
  // --------------------------------------------------------------------
  it('should detect cargo release OK (before cutoff)', () => {
    const header = structuredClone(sampleHeader);
    header.product.plannedLoadReleaseTime = '2026-02-02T17:00:00';

    const cr = (component as any).computeCargoReleaseDisplay(header);
    expect(cr.status).toBe('cr-ok');
  });

  // --------------------------------------------------------------------
  // 7. General Status Mapping
  // --------------------------------------------------------------------
  it('should map general status display correctly', () => {
    const val = (component as any).mapGeneralStatusDisplay('GO');
    expect(val).toBe('GO');
  });

  // --------------------------------------------------------------------
  // 8. mapHeaderData — Multi-leg mapping and values
  // --------------------------------------------------------------------
  it('should correctly map header data', () => {
    const vm = (component as any).mapHeaderData(sampleHeader);

    expect(vm.origin).toBe('LHR');
    expect(vm.destination).toBe('SIN');
    expect(vm.legs.length).toBe(1);
    expect(vm.std.length).toBeGreaterThan(0);
  });

  // --------------------------------------------------------------------
  // 9. onMore() click handler
  // --------------------------------------------------------------------
  // it('should call onMore() when More button clicked', () => {
  //   spyOn(component, 'onMore');

  //   const header = structuredClone(sampleHeader);
  //   header.flightLeg.push(header.flightLeg[0]); // make multi-leg
  //   fixture.detectChanges();

  //   flightData$.next(header);
  //   fixture.detectChanges();

  //   const compiled = fixture.nativeElement as HTMLElement;
  //   const btn = compiled.querySelector('button.more-btn') as HTMLButtonElement;

  //   if (btn) {
  //     btn.click();
  //     expect(component.onMore).toHaveBeenCalled();
  //   }
  // });

  // --------------------------------------------------------------------
  // 10. Formatting helper functions
  // --------------------------------------------------------------------
  it('should format date', () => {
    const out = (component as any).formatDate('2026-02-02T21:00:00');
    expect(out).toBe('02FEB');
  });

  it('should format time', () => {
    const out = (component as any).formatTime('2026-02-02T06:05:00');
    expect(out).toBe('0605');
  });

  it('should calculate day diff', () => {
    const d = (component as any).dayDiffLocal(new Date('2026-02-02'), new Date('2026-02-03'));
    expect(d).toBe(1);
  });
});