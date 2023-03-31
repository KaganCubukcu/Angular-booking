export interface HotelDataModel {
  address: string;
  cardBackground: string;
  amenities: string[];
  location: { lat: number; lng: number };
  name: string;
  rating: number;
  nightlyPrice: number;
  overview: string;
  accommodationType: string;
  photos: string[];
  rooms: { name: string; description: string; price: number };
}
