import { createReducer, on } from '@ngrx/store';
import { SearchStateInterface } from './search.model';
import * as SearchActions from './search.action';

export const initialState: SearchStateInterface = {
  search: {
    query: '',
    filters: {
      priceRange: { min: 0, max: 1000 },
      rating: [],
      amenities: [],
      accommodationType: []
    },
    sortBy: 'rating',
    sortOrder: 'desc',
    searchDetails: {
      destination: '',
      checkIn: '',
      checkOut: '',
      roomsGuests: ''
    }
  },
  isSearching: false,
  error: null
};

export const searchReducer = createReducer(
  initialState,
  on(SearchActions.setSearchQuery, (state, { query }) => ({
    ...state,
    search: {
      ...state.search,
      query,
      lastSearch: new Date()
    }
  })),

  on(SearchActions.updateSearchFilters, (state, { filters }) => ({
    ...state,
    search: {
      ...state.search,
      filters: {
        ...state.search.filters,
        ...filters
      }
    }
  })),

  on(SearchActions.setSortOptions, (state, { sortBy, sortOrder }) => ({
    ...state,
    search: {
      ...state.search,
      sortBy,
      sortOrder
    }
  })),

  on(SearchActions.updateSearchDetails, (state, { searchDetails }) => ({
    ...state,
    search: {
      ...state.search,
      searchDetails
    }
  })),

  on(SearchActions.updateSearchBar, (state, { searchBar }) => ({
    ...state,
    search: {
      ...state.search,
      searchDetails: searchBar
    }
  })),

  on(SearchActions.clearSearch, () => initialState),

  on(SearchActions.searchError, (state, { error }) => ({
    ...state,
    error
  }))
);
