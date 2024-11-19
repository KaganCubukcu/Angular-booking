import { createAction, props } from '@ngrx/store';
import { SearchFilters, SearchState, SearchBarDataModel } from './search.model';

export const setSearchQuery = createAction(
  '[Search] Set Search Query',
  props<{ query: string }>()
);

export const updateSearchFilters = createAction(
  '[Search] Update Search Filters',
  props<{ filters: Partial<SearchFilters> }>()
);

export const setSortOptions = createAction(
  '[Search] Set Sort Options',
  props<{ sortBy: SearchState['sortBy']; sortOrder: SearchState['sortOrder'] }>()
);

export const updateSearchDetails = createAction(
  '[Search] Update Search Details',
  props<{ searchDetails: SearchBarDataModel }>()
);

export const clearSearch = createAction('[Search] Clear Search');

export const searchError = createAction(
  '[Search] Search Error',
  props<{ error: string }>()
);
