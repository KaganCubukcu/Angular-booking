import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { loggedInUserSelector } from 'src/app/features/auth/store/auth.selectors';

import { AuthService } from 'src/app/core/services/auth.service';
import { UserModel } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {
  loggedInUser$ = this.store.select(loggedInUserSelector);
  currentUser$: Observable<UserModel | null>;
  firstName = '';
  menuActive = false;
  isMobile = false;
  isAdmin = false;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly store: Store<AppStateInterface>,
    private router: Router,
    private authService: AuthService
  ) {
    this.checkScreenSize();
    this.currentUser$ = this.authService.currentUser$;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit(): void {
    // Still use store for backward compatibility
    this.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((loggedInUser) => {
        if (loggedInUser && loggedInUser.length > 0) {
          this.firstName = loggedInUser[0].user.firstName;
        } else {
          this.firstName = '';
        }
      });

    // Use AuthService for more reliable auth state
    this.currentUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        console.log('Current user state:', user);
        if (user) {
          this.firstName = user.firstName;
          this.isAdmin = user.isAdmin;
        } else {
          this.firstName = '';
          this.isAdmin = false;
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
    // Use AuthService for logout
    this.authService.logout(true);
    // Navigate to home page is handled by the service
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
