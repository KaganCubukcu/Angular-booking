import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { loggedInUserSelector } from 'src/app/features/auth/store/auth.selectors';
import * as AuthActions from 'src/app/features/auth/store/auth.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  loggedInUser$ = this.store.select(loggedInUserSelector);
  firstName = '';
  menuActive = false;
  isMobile = false;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly store: Store<AppStateInterface>,
    private router: Router
  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit(): void {
    this.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((loggedInUser) => {
        if (loggedInUser && loggedInUser.length > 0) {
          this.firstName = loggedInUser[0].user.firstName;
        } else {
          this.firstName = '';
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

  logout() {
    // Close menu first
    this.menuActive = false;
    // Dispatch logout action (you might need to define this action)
    this.store.dispatch(AuthActions.logout());
    // Navigate to home page
    this.router.navigate(['/']);
  }

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const menuToggleBtn = document.querySelector('.menu-toggle-button');
    const userMenu = document.querySelector('.user-menu');

    if (!menuToggleBtn?.contains(target) && !userMenu?.contains(target) && this.menuActive) {
      this.menuActive = false;
    }
  }
}
