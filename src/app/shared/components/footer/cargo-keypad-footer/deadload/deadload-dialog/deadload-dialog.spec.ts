import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadloadDialog } from './deadload-dialog';

describe('DeadloadDialog', () => {
  let component: DeadloadDialog;
  let fixture: ComponentFixture<DeadloadDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeadloadDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeadloadDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
