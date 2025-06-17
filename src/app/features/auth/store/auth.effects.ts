import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, exhaustMap, map, of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthLoginModel, AuthSignupModel } from './auth.model';
import { AuthResponseModel } from 'src/app/core/models/user.model';

@Injectable()
export class AuthEffects {
  constructor(private readonly actions$: Actions, private readonly authService: AuthService) { }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map((response: AuthResponseModel) => {
            // Convert AuthResponseModel to AuthLoginModel
            const authLoginModel: AuthLoginModel = {
              email: response.user.email,
              password: '', // We don't store password
              user: {
                _id: response.user._id,
                firstName: response.user.firstName,
                lastName: response.user.lastName,
                email: response.user.email,
                password: '',
                phoneNumber: response.user.phoneNumber
              }
            };
            return AuthActions.loginSuccess({ loggedInUser: [authLoginModel] });
          }),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUp),
      exhaustMap((action) =>
        this.authService
          .signup({
            firstName: action.firstName,
            lastName: action.lastName,
            email: action.email,
            phoneNumber: action.phoneNumber.toString(),
            password: action.password
          })
          .pipe(
            map(() => {
              // Convert action data to AuthSignupModel
              const authSignupModel: AuthSignupModel = {
                firstName: action.firstName,
                lastName: action.lastName,
                email: action.email,
                phoneNumber: action.phoneNumber.toString(),
                password: ''  // Don't store password
              };
              return AuthActions.signUpSuccess({ signUpUser: [authSignupModel] });
            }),
            catchError((error) => of(AuthActions.signUpFailure({ error })))
          )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => {
        // You could add any additional logout logic here if needed
        // For example, clearing localStorage token or other cleanup
        return AuthActions.logoutSuccess();
      }),
      catchError((error) => of(AuthActions.logoutFailure({ error: error.message })))
    )
  );
}
