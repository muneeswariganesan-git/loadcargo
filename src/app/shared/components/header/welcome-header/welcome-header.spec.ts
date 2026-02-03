import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeHeader } from './welcome-header';

describe('WelcomeHeader', () => {
  let component: WelcomeHeader;
  let fixture: ComponentFixture<WelcomeHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
