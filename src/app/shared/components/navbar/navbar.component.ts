import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { loggedInUserSelector } from 'src/app/features/auth/store/auth.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  loggedInUser$ = this.store.select(loggedInUserSelector);
  firstName = '';
  menuActive = false;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly store: Store<AppStateInterface>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((loggedInUser) => {
        if (loggedInUser && loggedInUser.length > 0) {
          this.firstName = loggedInUser[0].user.firstName;
        } else {
          console.error('User is not logged in');
        }
      });
  }
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  navigateToHotelListing() {
    this.router.navigate(['/hotel-listing'], {
      queryParams: { showAll: 'true' },
    });
  }
}
