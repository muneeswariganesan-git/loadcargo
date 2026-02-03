import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMailTelex } from './send-mail-telex';

describe('SendMailTelex', () => {
  let component: SendMailTelex;
  let fixture: ComponentFixture<SendMailTelex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendMailTelex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendMailTelex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
