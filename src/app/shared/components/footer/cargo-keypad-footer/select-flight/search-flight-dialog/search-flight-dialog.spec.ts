import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFlightDialog } from './search-flight-dialog';

describe('SearchFlightDialog', () => {
  let component: SearchFlightDialog;
  let fixture: ComponentFixture<SearchFlightDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFlightDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFlightDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
