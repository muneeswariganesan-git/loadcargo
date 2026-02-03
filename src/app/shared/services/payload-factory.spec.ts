import { TestBed } from '@angular/core/testing';

import { PayloadFactory } from './payload-factory';

describe('PayloadFactory', () => {
  let service: PayloadFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayloadFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
