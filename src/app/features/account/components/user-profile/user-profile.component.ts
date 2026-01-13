import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { AuthLoginModel } from 'src/app/features/auth/store/auth.model';
import { loggedInUserSelector } from 'src/app/features/auth/store/auth.selectors';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    standalone: false
})
export class UserProfileComponent implements OnInit, OnDestroy {
  loggedInUser$!: Observable<AuthLoginModel[]>;
  activeTab = 'account';
  firstName = '';
  lastName = '';
  userEmail = '';

  unsubscribe$ = new Subject<void>();

  constructor(private readonly store: Store<AppStateInterface>, private readonly router: Router) {}

  ngOnInit(): void {
    this.loggedInUser$ = this.store.select(loggedInUserSelector).pipe(map(user => user || []),
      takeUntil(this.unsubscribe$)
    );
    this.loggedInUser$.subscribe((loggedInUser) => {
      if (loggedInUser) {
        this.firstName = loggedInUser[0].user.firstName;
        this.lastName = loggedInUser[0].user.lastName;
        this.userEmail = loggedInUser[0].user.email;
      } else {
        console.error(new Error('Logged in user not found'));
      }
    });
}

  get loggedInUser(): AuthLoginModel[] {
    let userArray: AuthLoginModel[] = [];
    this.loggedInUser$.subscribe(users => userArray = users);
    return userArray; 
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/']).then(() => {
      location.reload();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}