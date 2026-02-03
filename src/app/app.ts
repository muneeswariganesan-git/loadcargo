import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackButtonBlocker } from './core/navigation/back-button-blocker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private backBlocker: BackButtonBlocker) {}

  ngOnInit(): void {
    this.backBlocker.enableBlocker();
  }

  ngOnDestroy(): void {
    this.backBlocker.disableBlocker();
  }
}
