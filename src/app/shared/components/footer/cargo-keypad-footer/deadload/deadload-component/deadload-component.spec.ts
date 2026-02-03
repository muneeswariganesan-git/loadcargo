import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadloadComponent } from './deadload-component';

describe('DeadloadComponent', () => {
  let component: DeadloadComponent;
  let fixture: ComponentFixture<DeadloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeadloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeadloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
