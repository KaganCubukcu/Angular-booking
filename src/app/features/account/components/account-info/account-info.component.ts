import { Component, OnInit, Input } from '@angular/core';
import { User } from '@features/auth/store/auth.state';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
})
export class AccountInfoComponent implements OnInit {
  @Input() userData!: User;

  userInfoContainers = [
    {
      label: 'Name',
      value: '',
      button: 'Change',
    },
    {
      label: 'Email',
      value: '',
      button: 'Change',
    },
    {
      label: 'Password',
      value: '**********',
      button: 'Change',
    },
    {
      label: 'Phone number',
      value: '',
      button: 'Change',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    if (this.userData) {
      this.userInfoContainers[0].value = `${this.userData.firstName} ${this.userData.lastName}`;
      this.userInfoContainers[1].value = this.userData.email;
      this.userInfoContainers[3].value = this.userData.phoneNumber;
    } else {
      console.error(new Error('Logged in user not found'));
    }
  }
}
