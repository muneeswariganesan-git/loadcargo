import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoRelease } from './cargo-release';

describe('CargoRelease', () => {
  let component: CargoRelease;
  let fixture: ComponentFixture<CargoRelease>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargoRelease]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargoRelease);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
