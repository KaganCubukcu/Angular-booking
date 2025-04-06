import { createAction, props } from '@ngrx/store';
import { BookingModel } from './booking.model';

export const bookRoom = createAction(
    '[Booking] Book Room',
    props<{ bookingDetails: BookingModel }>()
);

export const bookRoomSuccess = createAction(
    '[Booking] Book Room Success',
    props<{ bookingDetails: BookingModel }>()
);

export const bookRoomFailure = createAction(
    '[Booking] Book Room Failure',
    props<{ error: string }>()
);

export const clearBooking = createAction(
    '[Booking] Clear Booking'
); 