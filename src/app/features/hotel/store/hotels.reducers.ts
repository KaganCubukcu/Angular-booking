import { HotelsStateInterface } from './hotel.model';
import { createReducer, on } from '@ngrx/store';
import * as HotelsActions from './hotels.actions';

export const initialState: HotelsStateInterface = {
  hotels: [],
  selectedHotel: null,
  isLoading: false,
  error: null,
};

export const hotelReducer = createReducer(
  initialState,
  on(HotelsActions.loadHotels, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(HotelsActions.loadHotelsSuccess, (state, action) => ({
    ...state,
    hotels: action.hotels,
    isLoading: false,
    error: null
  })),

  on(HotelsActions.loadHotelsFailure, (state, action) => ({
    ...state,
    error: action.error,
    isLoading: false
  })),

  on(HotelsActions.selectHotel, (state, action) => ({
    ...state,
    selectedHotel: state.hotels.find(hotel => hotel.id === action.hotelId) || null
  })),

  on(HotelsActions.clearSelectedHotel, (state) => ({
    ...state,
    selectedHotel: null
  }))
);
