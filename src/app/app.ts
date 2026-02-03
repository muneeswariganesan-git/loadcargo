import { Component, DestroyRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';

import { filter } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BackButtonBlocker } from './core/navigation/back-button-blocker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(
    private backBlocker: BackButtonBlocker,
    private msal: MsalService,
    private broadcast: MsalBroadcastService,
    private destroyRef: DestroyRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.backBlocker.enableBlocker();

    let accounts = this.msal.instance.getAllAccounts();

    if (accounts.length && !this.msal.instance.getActiveAccount()) {
      this.msal.instance.setActiveAccount(accounts[0]);
    }

    this.broadcast.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((msg: EventMessage) => {
        const result = msg.payload as AuthenticationResult;
        if (result?.account) {
          this.msal.instance.setActiveAccount(result.account);
          console.log('[MSAL] LOGIN_SUCCESS → Active account set.');
        }
      });

    await firstValueFrom(
      this.broadcast.inProgress$.pipe(filter((status) => status === InteractionStatus.None))
    );

    accounts = this.msal.instance.getAllAccounts();
    if (!this.msal.instance.getActiveAccount() && accounts.length) {
      this.msal.instance.setActiveAccount(accounts[0]);
      console.log('[MSAL] Active account set after idle.');
    }
  }

  ngOnDestroy() {
    this.backBlocker.disableBlocker();
  }
}
