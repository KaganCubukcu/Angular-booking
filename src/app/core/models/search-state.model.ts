import { SearchState } from '../../features/hotel/store/search/search.model';
import { ErrorState } from '../../features/hotel/store/hotel.model';

export interface SearchStateInterface {
  search: SearchState;
  isSearching: boolean;
  error: ErrorState | null;
}
