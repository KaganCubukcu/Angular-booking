import { Component, OnInit } from '@angular/core';
import * as HotelsActions from './features/hotel/store/hotels.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(HotelsActions.loadHotels());
  }
}
