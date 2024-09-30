import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <app-header></app-header>
      <app-search-bar style="position: relative; top: -140px;"></app-search-bar>
      <app-content></app-content>
    </div>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
