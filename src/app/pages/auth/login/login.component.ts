import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../features/auth/store/auth.actions';
import * as AuthSelectors from '../../../features/auth/store/auth.selectors';
import { AppStateInterface } from '../../../core/models/app-state.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<AppStateInterface>,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.store.select(AuthSelectors.loggedInUserSelector).subscribe((loggedInUser) => {
      if (loggedInUser) this.router.navigate(['/']);
    });
  }

  onSubmit() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.store.select(AuthSelectors.loggedInUserSelector).subscribe((loggedInUser) => {
      if (!loggedInUser) {
        this.loginForm.get('errorMessage')?.setValue('Invalid Email or Password');
      } else {
        this.loginForm.get('errorMessage')?.setValue('');
      }
    });

    this.store.dispatch(AuthActions.login({ email, password }));
  }
}
