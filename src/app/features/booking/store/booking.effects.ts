import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, tap } from 'rxjs';
import * as BookingActions from './booking.actions';
import { Router } from '@angular/router';

@Injectable()
export class BookingEffects {
    constructor(
        private actions$: Actions,
        private router: Router
    ) { }

    bookRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BookingActions.bookRoom),
            map((action) => BookingActions.bookRoomSuccess({ bookingDetails: action.bookingDetails })),
            catchError((error) => of(BookingActions.bookRoomFailure({ error: error.message })))
        )
    );

    // Navigate to payment page after booking success
    navigateToPayment$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(BookingActions.bookRoomSuccess),
                tap(() => {
                    this.router.navigate(['/payment']);
                })
            ),
        { dispatch: false }
    );
} 