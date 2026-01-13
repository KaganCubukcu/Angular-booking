import { Component, OnInit, Input } from '@angular/core';

interface User {
  firstName: string;
  email: string;
  phoneNumber: string;
}

interface LoggedInUser {
  user: User;
}

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
  standalone: false
})
export class AccountInfoComponent implements OnInit {
  @Input() loggedInUser!: LoggedInUser[];

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

  ngOnInit(): void {
    if (this.loggedInUser) {
      this.userInfoContainers[0].value = this.loggedInUser[0].user.firstName;
      this.userInfoContainers[1].value = this.loggedInUser[0].user.email;
      this.userInfoContainers[3].value = this.loggedInUser[0].user.phoneNumber;
    } else {
      console.error(new Error('Logged in user not found'));
    }
  }
}
