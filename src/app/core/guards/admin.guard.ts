import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.isLoggedIn && this.authService.isAdmin) {
            return true;
        }

        // Redirect to login if not logged in, or to home if logged in but not admin
        if (!this.authService.isLoggedIn) {
            return this.router.createUrlTree(['/login'], {
                queryParams: { returnUrl: state.url }
            });
        } else {
            // User is logged in but not an admin
            return this.router.createUrlTree(['/']);
        }
    }
} 