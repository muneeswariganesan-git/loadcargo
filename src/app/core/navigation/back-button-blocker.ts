import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackButtonBlocker {
  private intervalId: any;

  enableBlocker(): void {
    // Push initial state
    history.pushState(null, '', window.location.href);

    // Listen for back/forward navigation
    window.addEventListener('popstate', this.blockBack);

    // Keep adding states periodically so the stack never empties
    this.intervalId = setInterval(() => {
      history.pushState(null, '', window.location.href);
    }, 500); // every 0.5 second
  }

  disableBlocker(): void {
    window.removeEventListener('popstate', this.blockBack);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private blockBack = (): void => {
    history.pushState(null, '', window.location.href);
  };
}
