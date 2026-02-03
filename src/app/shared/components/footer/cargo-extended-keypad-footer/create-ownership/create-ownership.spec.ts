import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOwnership } from './create-ownership';

describe('CreateOwnership', () => {
  let component: CreateOwnership;
  let fixture: ComponentFixture<CreateOwnership>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOwnership]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOwnership);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
