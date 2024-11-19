import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../../../data-access/services/data.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { HotelDataModel } from './hotel.model';
import * as HotelsActions from './hotels.actions';

@Injectable()
export class HotelsEffects {
  constructor(private readonly actions$: Actions, private readonly dataService: DataService) {}

  getHotels$ = createEffect(() => this.actions$.pipe(ofType(HotelsActions.loadHotels),
    switchMap(() => {
      return this.dataService.getHotels().pipe(
        map((hotels: HotelDataModel[]) =>
          HotelsActions.loadHotelsSuccess({ hotels })
        ),
        catchError((error: string) =>
          of(HotelsActions.loadHotelsFailure({ error }))
        )
      );
    })
  ));

}