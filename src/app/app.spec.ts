// app.spec.ts
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { App } from './app';

import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
  InteractionType
} from '@azure/msal-browser';

import { BackButtonBlocker } from './core/navigation/back-button-blocker';

describe('App Component', () => {
  let msalServiceMock: any;
  let broadcastMock: any;
  let backButtonMock: any;

  let loginSuccessSubject: Subject<EventMessage>;
  let inProgressSubject: Subject<InteractionStatus>;

  const createMockAuthResult = (): AuthenticationResult => ({
    authority: 'https://login.microsoftonline.com/tenant',
    uniqueId: 'unique-id',
    tenantId: 'tenant-id',
    scopes: [],
    account: { username: 'loggedUser' } as any, // keep simple for test
    idToken: 'id-token',
    idTokenClaims: {} as any,
    accessToken: 'access-token',
    fromCache: false,
    expiresOn: new Date(Date.now() + 3600 * 1000),
    tokenType: 'Bearer',
    correlationId: 'corr-id'
  });

  beforeEach(async () => {
    loginSuccessSubject = new Subject<EventMessage>();
    inProgressSubject = new Subject<InteractionStatus>();

    msalServiceMock = {
      instance: {
        getAllAccounts: jasmine.createSpy().and.returnValue([{ username: 'user1' }]),
        getActiveAccount: jasmine.createSpy().and.returnValue(null),
        setActiveAccount: jasmine.createSpy()
      }
    };

    broadcastMock = {
      msalSubject$: loginSuccessSubject.asObservable(),
      inProgress$: inProgressSubject.asObservable()
    };

    backButtonMock = {
      enableBlocker: jasmine.createSpy(),
      disableBlocker: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: MsalService, useValue: msalServiceMock },
        { provide: MsalBroadcastService, useValue: broadcastMock },
        { provide: BackButtonBlocker, useValue: backButtonMock }
      ]
    }).compileComponents();
  });

  function setupComponent() {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    return { fixture, component };
  }

  // ----------------------------------------------------------------------
  // TESTS
  // ----------------------------------------------------------------------

  it('should enable back button blocker on ngOnInit', async () => {
    const { component } = setupComponent();

    // Resolve firstValueFrom(inProgress$)
    setTimeout(() => inProgressSubject.next(InteractionStatus.None), 0);

    await component.ngOnInit();

    expect(backButtonMock.enableBlocker).toHaveBeenCalled();
  });

  it('should set active account on init if accounts exist and none active', async () => {
    const { component } = setupComponent();

    setTimeout(() => inProgressSubject.next(InteractionStatus.None), 0);

    await component.ngOnInit();

    expect(msalServiceMock.instance.setActiveAccount).toHaveBeenCalledWith(
      { username: 'user1' }
    );
  });

  it('should set active account on LOGIN_SUCCESS event', async () => {
    const { component } = setupComponent();

    setTimeout(() => inProgressSubject.next(InteractionStatus.None), 0);

    await component.ngOnInit();

    const mockAuth = createMockAuthResult();

    // Emit a fully shaped MSAL EventMessage
    const event: EventMessage = {
      
      eventType: EventType.LOGIN_SUCCESS,
      timestamp: Date.now(),
      interactionType: InteractionType.Redirect, // or Popup, depending on your flow
      payload: mockAuth,
      error: null
    };

    loginSuccessSubject.next(event);

    expect(msalServiceMock.instance.setActiveAccount)
      .toHaveBeenCalledWith(mockAuth.account);
  });

  it('should set active account after idle if no active account', async () => {
    const { component } = setupComponent();

    msalServiceMock.instance.getActiveAccount.and.returnValue(null);

    setTimeout(() => inProgressSubject.next(InteractionStatus.None), 0);

    await component.ngOnInit();

    expect(msalServiceMock.instance.setActiveAccount)
      .toHaveBeenCalledWith({ username: 'user1' });
  });

  it('should disable blocker on destroy', () => {
    const { component } = setupComponent();

    component.ngOnDestroy();

    expect(backButtonMock.disableBlocker).toHaveBeenCalled();
  });
});