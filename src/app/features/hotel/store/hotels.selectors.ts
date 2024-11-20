import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HotelsStateInterface } from '@core/models/hotels-state.model';
import { adapter } from './hotels.reducers';
import { HotelDataModel } from './hotel.model';

export const selectHotelsState = createFeatureSelector<HotelsStateInterface>('hotels');

export const {
  selectIds: selectHotelIds,
  selectEntities: selectHotelEntities,
  selectAll: selectAllHotels,
  selectTotal: selectHotelTotal,
} = adapter.getSelectors(selectHotelsState);

export const selectSelectedHotelId = createSelector(
  selectHotelsState,
  (state: HotelsStateInterface) => state.selectedHotelId
);

export const selectSelectedHotel = createSelector(
  selectHotelEntities,
  selectSelectedHotelId,
  (entities: Record<string, HotelDataModel | undefined>, selectedId: string | null) => 
    selectedId && entities[selectedId] ? entities[selectedId] : null
);

export const isLoadingSelector = createSelector(
  selectHotelsState,
  (state: HotelsStateInterface) => state.isLoading
);

export const errorSelector = createSelector(
  selectHotelsState,
  (state: HotelsStateInterface) => state.error
);

export const selectSortedHotelsByPrice = createSelector(
  selectAllHotels,
  (hotels: HotelDataModel[]) => [...hotels].sort((a, b) => a.nightlyPrice - b.nightlyPrice)
);

export const selectSortedHotelsByRating = createSelector(
  selectAllHotels,
  (hotels: HotelDataModel[]) => [...hotels].sort((a, b) => b.rating - a.rating)
);

export const createSelectHotelsByType = (type: string) => createSelector(
  selectAllHotels,
  (hotels: HotelDataModel[]) => hotels.filter((hotel: HotelDataModel) => hotel.accommodationType === type)
);