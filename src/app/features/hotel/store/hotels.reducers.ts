import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HotelDataModel, HotelsStateInterface } from './hotel.model';
import * as HotelsActions from './hotels.actions';

export const adapter: EntityAdapter<HotelDataModel> = createEntityAdapter<HotelDataModel>({
  selectId: (hotel: HotelDataModel) => hotel.id,
  sortComparer: (a: HotelDataModel, b: HotelDataModel) => b.rating - a.rating,
});

export const initialState: HotelsStateInterface = adapter.getInitialState({
  selectedHotelId: null,
  isLoading: false,
  error: null,
});

export const hotelReducer = createReducer(
  initialState,
  
  on(HotelsActions.loadHotels, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(HotelsActions.loadHotelsSuccess, (state, { hotels }) => {
    return adapter.setAll(hotels, {
      ...state,
      isLoading: false,
      error: null
    });
  }),

  on(HotelsActions.loadHotelsFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),

  on(HotelsActions.selectHotel, (state, { hotelId }) => ({
    ...state,
    selectedHotelId: hotelId
  })),

  on(HotelsActions.clearSelectedHotel, (state) => ({
    ...state,
    selectedHotelId: null
  }))
);
