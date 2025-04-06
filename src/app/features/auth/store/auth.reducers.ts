import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthStateInterface } from '../../../core/models/auth-state.model';

export const initialState: AuthStateInterface = {
  loggedInUser: null,
  signUpUser: null,
  error: null,
};

export const AuthReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    loggedInUser: action.loggedInUser,
    loginResult: { success: true },
  })),
  on(AuthActions.loginFailure, (state, action) => ({
    ...state,
    error: action.error,
    loginResult: { success: false, message: action.error },
  })),
  on(AuthActions.signUpSuccess, (state, action) => ({
    ...state,
    signUpUser: action.signUpUser,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    loggedInUser: null,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    loggedInUser: null,
  })),
  on(AuthActions.logoutFailure, (state, action) => ({
    ...state,
    error: action.error,
  }))
);
