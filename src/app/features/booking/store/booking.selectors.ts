import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingStateInterface } from '../../../core/models/booking-state.model';

export const selectBookingState = createFeatureSelector<BookingStateInterface>('booking');

export const selectBookingDetails = createSelector(
    selectBookingState,
    (state: BookingStateInterface) => state.bookingDetails
);

export const selectBookingError = createSelector(
    selectBookingState,
    (state: BookingStateInterface) => state.error
); 