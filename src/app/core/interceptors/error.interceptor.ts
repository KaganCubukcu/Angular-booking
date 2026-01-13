import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Check if it's a token expiry error
                    const errorBody = error.error;
                    
                    if (errorBody?.code === 'TOKEN_EXPIRED' || errorBody?.code === 'INVALID_TOKEN') {
                        // Token has expired, logout user
                        this.authService.logout(false); // Don't navigate yet
                        
                        // Redirect to login with message
                        this.router.navigate(['/login'], {
                            queryParams: {
                                sessionExpired: 'true',
                                returnUrl: this.router.url
                            }
                        });
                    }
                }
                
                return throwError(() => error);
            })
        );
    }
}
