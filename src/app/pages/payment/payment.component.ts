import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadStripe } from '@stripe/stripe-js';
import { Subject, takeUntil } from 'rxjs';
import { AppStateInterface } from '@core/models/app-state.model';
import { selectUser } from '@features/auth/store/auth.selectors';
import { HotelDataModel } from '@features/hotel/store/hotel.model';
import { selectSearchDetails } from '@features/hotel/store/search/search.selector';
import { environment } from '@env/environments';

interface RoomDetails {
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  room?: RoomDetails;
  hotel?: HotelDataModel;
  firstName = '';
  lastName = '';
  discount = 0;
  readonly tax = 0.18;
  readonly serviceFee = 5;
  totalPrice = 0;
  checkInDate = '';
  checkOutDate = '';
  roomsGuests = '';

  private destroy$ = new Subject<void>();
  user$ = this.store.select(selectUser);

  constructor(
    private readonly store: Store<AppStateInterface>,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  private readonly stripeKey = environment.stripeKey;

  ngOnInit(): void {
    this.initializeRoomDetails();
    this.initializeUserDetails();
    this.initializeSearchDetails();
    this.initializeHotelDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeRoomDetails(): void {
    const storedRoomName = localStorage.getItem('roomName');
    const storedRoomPrice = localStorage.getItem('roomPrice');
    const storedRoomDescription = localStorage.getItem('roomDescription');

    if (!storedRoomName || !storedRoomPrice) {
      this.router.navigate(['/hotels']);
      return;
    }

    this.room = {
      name: storedRoomName,
      price: Number(storedRoomPrice),
      description: storedRoomDescription || '',
    };
  }

  private initializeUserDetails(): void {
    this.user$.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          if (user) {
            this.firstName = user.firstName;
            this.lastName = user.lastName;
          } else {
            this.router.navigate(['/auth/login']);
          }
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
          this.router.navigate(['/auth/login']);
        }
      });
  }

  private initializeSearchDetails(): void {
    this.store.select(selectSearchDetails)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (searchDetails) => {
          if (searchDetails) {
            this.checkInDate = searchDetails.checkIn;
            this.checkOutDate = searchDetails.checkOut;
            this.roomsGuests = searchDetails.roomsGuests;
            this.calculateTotalPrice();
          }
        },
        error: (error) => {
          console.error('Error fetching search details:', error);
        }
      });
  }

  private initializeHotelDetails(): void {
    const storedHotelName = localStorage.getItem('selectedHotel');
    if (!storedHotelName) {
      this.router.navigate(['/hotels']);
      return;
    }

    this.store.select(state => state.hotels)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (state) => {
          const hotel = Object.values(state.entities).find(h => h?.name === storedHotelName);
          if (!hotel) {
            this.router.navigate(['/hotels']);
            return;
          }
          this.hotel = hotel;
        },
        error: (error) => {
          console.error('Error fetching hotel details:', error);
          this.router.navigate(['/hotels']);
        }
      });
  }

  private calculateTotalPrice(): void {
    try {
      const numberOfGuests = this.calculateNumberOfGuests();
      const numberOfDays = this.calculateNumberOfDays();

      if (numberOfDays <= 0) {
        throw new Error('Invalid date range');
      }

      const basePrice = (this.room?.price || 0) * numberOfGuests * numberOfDays;
      const taxAmount = basePrice * this.tax;
      this.totalPrice = basePrice + taxAmount + this.serviceFee - this.discount;
    } catch (error) {
      console.error('Error calculating total price:', error);
      this.totalPrice = 0;
    }
  }

  private calculateNumberOfGuests(): number {
    if (!this.roomsGuests) return 1;

    const [, adults, children] = this.roomsGuests.split(',');
    return parseInt(adults) + parseInt(children);
  }

  private calculateNumberOfDays(): number {
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  onCheckout(): void {
    if (!this.room || !this.hotel) {
      console.error('Missing room or hotel details');
      return;
    }

    const payload = {
      name: `${this.firstName} ${this.lastName}'s Payment`,
      amount: this.totalPrice,
      roomName: this.room.name,
      roomPhoto: this.hotel.photos[0],
      hotelName: this.hotel.name,
    };

    this.http.post(`${environment.apiUrl}/checkout`,payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (res: any) => {
          try {
            const stripe = await loadStripe(this.stripeKey);
            if (!stripe) {
              throw new Error('Failed to load Stripe');
            }
            await stripe.redirectToCheckout({ sessionId: res.id });
          } catch (error) {
            console.error('Stripe checkout error:', error);
          }
        },
        error: (error) => {
          console.error('Checkout request error:', error);
        }
      });
  }
}
