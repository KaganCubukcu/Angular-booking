export interface Room {
  name: string;
  description: string;
  price: number;
}

export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  country: string;
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
}

export interface ErrorState {
  message: string;
  code?: string;
  timestamp?: Date;
}

export interface HotelsStateInterface {
  hotels: HotelDataModel[];
  selectedHotel: HotelDataModel | null;
  isLoading: boolean;
  error: ErrorState | null;
}
