import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthLoginModel, AuthSignupModel } from '../../features/auth/store/auth.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments.prod';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AuthLoginModel> {
    return this.http.post<AuthLoginModel>(`${this.apiUrl}/user/login`, {
      email,
      password,
    });
  }

  signUp(firstName: string, lastName: string, email: string, phoneNumber: number, password: string): Observable<AuthSignupModel> {
    return this.http.post<AuthSignupModel>(`${this.apiUrl}/user/signup`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
  }
}
