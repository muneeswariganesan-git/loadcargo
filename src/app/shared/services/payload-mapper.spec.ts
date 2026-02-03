import { TestBed } from '@angular/core/testing';

import { PayloadMapper } from './payload-mapper';

describe('PayloadMapper', () => {
  let service: PayloadMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayloadMapper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
