import { createAction, props } from '@ngrx/store';
import { HotelDataModel, ErrorState } from 'src/app/features/hotel/store/hotel.model';

export const loadHotels = createAction('[Hotels] Load Hotels');

export const loadHotelsSuccess = createAction(
  '[Hotels] Load Hotels Success',
  props<{ hotels: HotelDataModel[] }>()
);

export const loadHotelsFailure = createAction(
  '[Hotels] Load Hotels Failure',
  props<{ error: ErrorState }>()
);

export const selectHotel = createAction(
  '[Hotels] Select Hotel',
  props<{ hotelId: string }>()
);

export const clearSelectedHotel = createAction(
  '[Hotels] Clear Selected Hotel'
);
