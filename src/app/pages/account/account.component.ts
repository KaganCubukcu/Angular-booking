import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  template: `
    <!-- Template Start -->
    <app-navbar class="active"></app-navbar>
    <app-profile-cover></app-profile-cover>
    <app-user-profile
      style="position: relative; top: -90px;"
    ></app-user-profile>
    <app-footer></app-footer>
    <!-- Template End -->
  `,
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {}
