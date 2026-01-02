import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadStripe } from '@stripe/stripe-js';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { loggedInUserSelector } from 'src/app/features/auth/store/auth.selectors';
import { HotelDataModel } from 'src/app/features/hotel/store/hotel.model';
import { environment } from 'src/environments/environments';
import { selectBookingDetails } from 'src/app/features/booking/store/booking.selectors';
import { Subject, takeUntil } from 'rxjs';
import * as BookingActions from 'src/app/features/booking/store/booking.actions';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  room: { name: string; price: number; description: string } | undefined;
  hotel: HotelDataModel | undefined;
  firstName = '';
  lastName = '';
  discount = 0;
  tax = 0.18;
  serviceFee = 5;
  totalPrice = 0;
  loggedInUser$ = this.store.select(loggedInUserSelector);
  bookingDetails$ = this.store.select(selectBookingDetails);
  checkInDate = '';
  checkOutDate = '';
  numberOfGuests = 1;
  numberOfDays = 1;
  loading = false;
  error: string | null = null;

  private unsubscribe$ = new Subject<void>();

  constructor(private readonly store: Store<AppStateInterface>, private readonly http: HttpClient, private readonly dataService: DataService) {}

  stripeKey = environment.stripeKey;

  ngOnInit() {
    // Get booking details from store
    this.bookingDetails$.pipe(takeUntil(this.unsubscribe$)).subscribe((bookingDetails) => {
      if (bookingDetails) {
        // Set room details
        this.room = {
          name: bookingDetails.roomName,
          price: bookingDetails.roomPrice,
          description: bookingDetails.roomDescription,
        };

        // Set booking dates
        this.checkInDate = bookingDetails.checkInDate;
        this.checkOutDate = bookingDetails.checkOutDate;
        this.numberOfGuests = bookingDetails.numberOfGuests;

        // Fetch hotel information using DataService
        this.loading = true;
        this.dataService
          .getHotelByName(bookingDetails.hotelName)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (hotel) => {
              this.hotel = hotel;
              this.loading = false;
              this.calculateTotalPrice();
            },
            error: (err) => {
              console.error('Error fetching hotel data:', err);
              this.error = 'Failed to load hotel information';
              this.loading = false;

              // Try fetching from all hotels
              this.dataService
                .getHotels()
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                  next: (hotels) => {
                    this.hotel = hotels.find((h) => h.name === bookingDetails.hotelName);
                    if (this.hotel) {
                      this.error = null;
                    }
                    this.calculateTotalPrice();
                  },
                  error: (err) => {
                    console.error('Error fetching all hotels:', err);
                  },
                });
            },
          });
      } else {
        console.error('No booking details found in store');
      }
    });

    this.loggedInUser$.pipe(takeUntil(this.unsubscribe$)).subscribe((loggedInUser) => {
      if (loggedInUser && loggedInUser.length > 0) {
        this.firstName = loggedInUser[0].user.firstName;
        this.lastName = loggedInUser[0].user.lastName;
      }
    });
  }

  calculateTotalPrice() {
    try {
      // Calculate number of days
      if (this.checkInDate && this.checkOutDate) {
        const checkInDate = new Date(this.checkInDate);
        const checkOutDate = new Date(this.checkOutDate);

        if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
          const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
          this.numberOfDays = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        }
      }

      // Calculate total price
      const basePrice = (this.room?.price || 0) * this.numberOfGuests * this.numberOfDays;
      const taxAmount = basePrice * this.tax;
      this.totalPrice = basePrice - this.discount + taxAmount + this.serviceFee;
    } catch (error) {
      console.error('Error calculating total price', error);
      // Fallback to base price if calculation fails
      this.totalPrice = this.room?.price || 0;
    }
  }

  onCheckout() {
    if (!this.hotel || !this.room) {
      console.error('Missing hotel or room data');
      return;
    }

    this.http
      .post<{ id: string }>(`${environment.apiUrl}/payment/checkout`, {
        name: `${this.firstName} ${this.lastName}'s Payment`,
        amount: this.totalPrice,
        roomName: this.room.name,
        roomPhoto: this.hotel.photos?.[0] || '',
        hotelName: this.hotel.name,
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        numberOfGuests: this.numberOfGuests,
        numberOfDays: this.numberOfDays,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (res) => {
        const stripe = await loadStripe(this.stripeKey);
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    // Clear booking data when leaving payment page
    this.store.dispatch(BookingActions.clearBooking());
  }
}
