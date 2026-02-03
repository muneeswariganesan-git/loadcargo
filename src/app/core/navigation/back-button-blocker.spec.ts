import { TestBed } from '@angular/core/testing';

import { BackButtonBlocker } from './back-button-blocker';

describe('BackButtonBlocker', () => {
  let service: BackButtonBlocker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackButtonBlocker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
