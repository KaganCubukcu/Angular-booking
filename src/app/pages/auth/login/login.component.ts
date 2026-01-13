import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../../../features/auth/store/auth.selectors';
import { AppStateInterface } from '../../../core/models/app-state.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginError: string | null = null;
  infoMessage: string | null = null;
  private destroy$ = new Subject<void>();
  public router: Router;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<AppStateInterface>,
    router: Router,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute
  ) {
    this.router = router;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

    ngOnInit() {
    // Check for session expired parameter
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['sessionExpired'] === 'true') {
          this.infoMessage = 'Your session has expired. Please login again.';
        }
      });

    // Check if already logged in
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.router.navigate(['/']);
        }
      });

    // Also keep the store subscription for backward compatibility
    this.store.select(AuthSelectors.loggedInUserSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loggedInUser) => {
        if (loggedInUser && loggedInUser.length > 0) {
          this.router.navigate(['/']);
        }
      });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.loginError = null;

    // Use AuthService directly for more reliable authentication
    this.authService.login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.loginError = 'Invalid email or password. Please try again.';
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
