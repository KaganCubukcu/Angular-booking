import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { AuthResponseModel, UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  get currentUser$(): Observable<UserModel | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue(): UserModel | null {
    return this.currentUserSubject.value;
  }

  get isAdmin(): boolean {
    return !!this.currentUserValue?.isAdmin;
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const user = localStorage.getItem(this.userKey);
    return !!(token && user && this.currentUserSubject.value);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${this.apiUrl}/user/login`, { email, password })
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  signup(userData: {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string
  }): Observable<{ user: UserModel }> {
    return this.http.post<{ user: UserModel }>(`${this.apiUrl}/user/signup`, userData);
  }

  logout(navigateToLogin = true): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);

    // Sadece isteniyorsa yönlendir (varsayılan olarak true)
    if (navigateToLogin) {
      this.router.navigate(['/']);
    }
  }

  refreshUserProfile(): Observable<{ user: UserModel }> {
    return this.http.get<{ user: UserModel }>(`${this.apiUrl}/user/me`)
      .pipe(
        tap(response => {
          const userData = response.user;
          this.currentUserSubject.next(userData);
          localStorage.setItem(this.userKey, JSON.stringify(userData));
        })
      );
  }

  private setSession(authResult: AuthResponseModel): void {
    localStorage.setItem(this.tokenKey, authResult.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        console.log('User loaded from storage:', user);
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
      }
    } else {
      this.currentUserSubject.next(null);
      console.log('No user in storage');
    }
  }
}
