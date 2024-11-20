import { EntityState } from '@ngrx/entity';
import { HotelDataModel, ErrorState } from '../../features/hotel/store/hotel.model';

export interface HotelsStateInterface extends EntityState<HotelDataModel> {
  selectedHotelId: string | null;
  isLoading: boolean;
  error: ErrorState | null;
}
