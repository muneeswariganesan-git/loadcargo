import { TestBed } from '@angular/core/testing';

import { CargoFlightHeader } from './cargo-flight-header';

describe('CargoFlightHeader', () => {
  let service: CargoFlightHeader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargoFlightHeader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
