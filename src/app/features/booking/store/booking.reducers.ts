import { createReducer, on } from '@ngrx/store';
import * as BookingActions from './booking.actions';
import { BookingStateInterface } from '../../../core/models/booking-state.model';

export const initialState: BookingStateInterface = {
    bookingDetails: null,
    error: null,
};

export const bookingReducer = createReducer(
    initialState,
    on(BookingActions.bookRoom, (state) => ({
        ...state,
    })),
    on(BookingActions.bookRoomSuccess, (state, action) => ({
        ...state,
        bookingDetails: action.bookingDetails,
        error: null,
    })),
    on(BookingActions.bookRoomFailure, (state, action) => ({
        ...state,
        error: action.error,
    })),
    on(BookingActions.clearBooking, (state) => ({
        ...state,
        bookingDetails: null,
    }))
); 