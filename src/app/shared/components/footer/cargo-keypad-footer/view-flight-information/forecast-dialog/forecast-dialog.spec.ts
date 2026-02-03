import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastDialog } from './forecast-dialog';

describe('ForecastDialog', () => {
  let component: ForecastDialog;
  let fixture: ComponentFixture<ForecastDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
