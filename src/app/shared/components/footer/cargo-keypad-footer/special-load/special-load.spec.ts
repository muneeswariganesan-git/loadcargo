import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialLoad } from './special-load';

describe('SpecialLoad', () => {
  let component: SpecialLoad;
  let fixture: ComponentFixture<SpecialLoad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialLoad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialLoad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
