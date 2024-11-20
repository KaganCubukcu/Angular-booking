import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SearchStateInterface } from './search.model';

export const selectSearchState = createFeatureSelector<SearchStateInterface>('search');

export const selectSearchQuery = createSelector(
  selectSearchState,
  (state: SearchStateInterface) => state.search.query
);

export const selectSearchFilters = createSelector(
  selectSearchState,
  (state: SearchStateInterface) => state.search.filters
);

export const selectSortOptions = createSelector(
  selectSearchState,
  (state: SearchStateInterface) => ({
    sortBy: state.search.sortBy,
    sortOrder: state.search.sortOrder
  })
);

export const selectSearchDetails = createSelector(
  selectSearchState,
  (state: SearchStateInterface) => state.search.searchDetails
);

export const selectPriceRange = createSelector(
  selectSearchFilters,
  (filters) => filters.priceRange
);

export const selectRatingFilters = createSelector(
  selectSearchFilters,
  (filters) => filters.rating
);

export const selectAmenityFilters = createSelector(
  selectSearchFilters,
  (filters) => filters.amenities
);

export const selectAccommodationTypeFilters = createSelector(
  selectSearchFilters,
  (filters) => filters.accommodationType
);

export const selectSearchError = createSelector(
  selectSearchState,
  (state: SearchStateInterface) => state.error
);

export const selectIsSearching = createSelector(
  selectSearchState,
  (state: SearchStateInterface) => state.isSearching
);