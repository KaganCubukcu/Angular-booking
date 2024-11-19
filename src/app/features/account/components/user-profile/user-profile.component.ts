import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppStateInterface } from '@core/models/app-state.model';
import { User } from '@features/auth/store/auth.state';
import { selectUser } from '@features/auth/store/auth.selectors';
import * as AuthActions from '@features/auth/store/auth.actions';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  user$: Observable<User | null>;
  userData!: User;
  activeTab = 'account';

  constructor(
    private readonly store: Store<AppStateInterface>,
    private readonly router: Router
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.initializeUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeUserData(): void {
    this.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.userData = user;
        }
      });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }
}