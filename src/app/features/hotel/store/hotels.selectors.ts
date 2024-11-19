import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HotelsStateInterface, HotelDataModel } from './hotel.model';

export const selectHotelsState = createFeatureSelector<HotelsStateInterface>('hotels');

export const isLoadingSelector = createSelector(
  selectHotelsState,
  (state: HotelsStateInterface) => state.isLoading
);

export const hotelsSelector = createSelector(
  selectHotelsState,
  (state: HotelsStateInterface) => state.hotels
);

export const errorSelector = createSelector(
  selectHotelsState,
  (state: HotelsStateInterface) => state.error
);

export const selectedHotelSelector = createSelector(
  selectHotelsState,
  (state: HotelsStateInterface) => state.selectedHotel
);

export const sortedHotelsByRating = createSelector(
  hotelsSelector,
  (hotels: HotelDataModel[]) => [...hotels].sort((a, b) => b.rating - a.rating)
);

export const sortedHotelsByPrice = createSelector(
  hotelsSelector,
  (hotels: HotelDataModel[]) => [...hotels].sort((a, b) => a.nightlyPrice - b.nightlyPrice)
);

export const hotelsByAccommodationType = (type: string) =>
  createSelector(
    hotelsSelector,
    (hotels: HotelDataModel[]) => hotels.filter(hotel => hotel.accommodationType === type)
  );