import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HotelsStateInterface, HotelDataModel } from './hotel.model';
import { adapter } from './hotels.reducers';

export const selectHotelsState = createFeatureSelector<HotelsStateInterface>('hotels');

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(selectHotelsState);

export const selectAllHotels = selectAll;
export const selectHotelEntities = selectEntities;
export const selectHotelIds = selectIds;
export const selectHotelTotal = selectTotal;

export const isLoadingSelector = createSelector(
  selectHotelsState,
  (state: HotelsStateInterface) => state.isLoading
);

export const errorSelector = createSelector(
  selectHotelsState,
  (state: HotelsStateInterface) => state.error
);

export const selectSelectedHotelId = createSelector(
  selectHotelsState,
  (state: HotelsStateInterface) => state.selectedHotelId
);

export const selectSelectedHotel = createSelector(
  selectHotelEntities,
  selectSelectedHotelId,
  (hotelEntities, selectedId) => selectedId ? hotelEntities[selectedId] : null
);

export const selectSortedHotelsByRating = createSelector(
  selectAllHotels,
  (hotels: HotelDataModel[]) => [...hotels].sort((a, b) => b.rating - a.rating)
);

export const selectSortedHotelsByPrice = createSelector(
  selectAllHotels,
  (hotels: HotelDataModel[]) => [...hotels].sort((a, b) => a.nightlyPrice - b.nightlyPrice)
);

export const selectHotelsByAccommodationType = (type: string) =>
  createSelector(
    selectAllHotels,
    (hotels: HotelDataModel[]) => hotels.filter(hotel => hotel.accommodationType === type)
  );