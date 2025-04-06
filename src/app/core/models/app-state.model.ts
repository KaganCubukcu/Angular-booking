import { HotelsStateInterface } from './hotels-state.model';
import { AuthStateInterface } from './auth-state.model';
import { SearchStateInterface } from './search-state.model';
import { BookingStateInterface } from './booking-state.model';

export interface AppStateInterface {
  hotels: HotelsStateInterface;
  auth: AuthStateInterface;
  search: SearchStateInterface;
  booking: BookingStateInterface;
}
