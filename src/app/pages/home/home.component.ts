import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <app-header></app-header>
      <app-search-bar></app-search-bar>
      <app-content></app-content>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `]
})
export class HomeComponent {}
