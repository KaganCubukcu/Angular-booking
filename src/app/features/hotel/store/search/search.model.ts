export interface SearchBarDataModel {
  destination: string;
  checkIn: string;
  checkOut: string;
  roomsGuests: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface SearchFilters {
  priceRange: PriceRange;
  rating: number[];
  amenities: string[];
  accommodationType: string[];
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  sortBy: 'price' | 'rating' | 'name';
  sortOrder: 'asc' | 'desc';
  lastSearch?: Date;
  searchDetails: SearchBarDataModel;
}

export interface SearchStateInterface {
  search: SearchState;
  isSearching: boolean;
  error: string | null;
}
