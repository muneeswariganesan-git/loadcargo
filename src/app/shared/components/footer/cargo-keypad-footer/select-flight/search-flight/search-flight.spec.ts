import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFlight } from './search-flight';

describe('SearchFlight', () => {
  let component: SearchFlight;
  let fixture: ComponentFixture<SearchFlight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFlight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFlight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
