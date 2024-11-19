import { EntityState } from '@ngrx/entity';

export interface Room {
  id?: string;
  name: string;
  description: string;
  price: number;
  capacity?: number;
  amenities?: string[];
  photos?: string[];
}

export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface HotelDataModel {
  id: string;
  address: Address;
  cardBackground: string;
  amenities: string[];
  location: Location;
  name: string;
  rating: number;
  nightlyPrice: number;
  overview: string;
  accommodationType: string;
  photos: string[];
  rooms: Room[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ErrorState {
  message: string;
  code?: string;
  timestamp?: Date;
  details?: any;
}

export interface HotelsStateInterface extends EntityState<HotelDataModel> {
  selectedHotelId: string | null;
  isLoading: boolean;
  error: ErrorState | null;
}
