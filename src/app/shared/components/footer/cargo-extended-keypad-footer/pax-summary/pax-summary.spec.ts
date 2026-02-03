import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaxSummary } from './pax-summary';

describe('PaxSummary', () => {
  let component: PaxSummary;
  let fixture: ComponentFixture<PaxSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaxSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaxSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
