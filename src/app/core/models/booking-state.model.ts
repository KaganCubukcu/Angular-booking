import { BookingModel } from '../../features/booking/store/booking.model';

export interface BookingStateInterface {
    bookingDetails: BookingModel | null;
    error: string | null;
} 