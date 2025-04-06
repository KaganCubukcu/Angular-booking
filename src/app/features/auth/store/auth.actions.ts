import { createAction, props } from '@ngrx/store';
import { AuthLoginModel, AuthSignupModel } from './auth.model';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ loggedInUser: AuthLoginModel[] }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const signUp = createAction(
  '[Auth] signUp',
  props<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    password: string;
  }>()
);
export const signUpSuccess = createAction(
  '[Auth] signUp Success',
  props<{ signUpUser: AuthSignupModel[] }>()
);
export const signUpFailure = createAction(
  '[Auth] signUp Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);
