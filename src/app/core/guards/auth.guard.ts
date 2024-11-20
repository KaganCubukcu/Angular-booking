import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take, of } from 'rxjs';
import { selectIsAuthenticated } from '@features/auth/store/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private store: Store
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (route.routeConfig?.path?.includes('payment')) {
      return this.store.select(selectIsAuthenticated).pipe(
        take(1),
        map(isAuthenticated => {
          if (isAuthenticated) {
            return true;
          }

          this.router.navigate(['/login']);
          return false;
        })
      );
    }
    
    return of(true);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.canActivate(route);
  }
}
