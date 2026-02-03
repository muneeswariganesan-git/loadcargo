import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOwnership } from './view-ownership';

describe('ViewOwnership', () => {
  let component: ViewOwnership;
  let fixture: ComponentFixture<ViewOwnership>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOwnership]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOwnership);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
