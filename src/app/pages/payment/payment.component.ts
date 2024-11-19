import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadStripe } from '@stripe/stripe-js';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { loggedInUserSelector } from 'src/app/features/auth/store/auth.selectors';
import { HotelDataModel } from 'src/app/features/hotel/store/hotel.model';
import { selectSearchResult } from 'src/app/features/hotel/store/search/search.selector';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  room: { name: string; price: number; description: string } | undefined;
  hotel: HotelDataModel | undefined;
  firstName = '';
  lastName = '';
  discount = 0;
  tax = 0.18;
  serviceFee = 5;
  totalPrice = 0;
  loggedInUser$ = this.store.select(loggedInUserSelector);
  checkInDate = '';
  checkOutDate = '';
  roomsGuests = '';

  constructor(private readonly store: Store<AppStateInterface>, private readonly http: HttpClient) {}
  stripeKey = environment.stripeKey;

  ngOnInit() {
    const storedHotelName = localStorage.getItem('hotelName');
    const storedRoomName = localStorage.getItem('roomName');
    const storedRoomPrice = localStorage.getItem('roomPrice');
    const storedRoomDescription = localStorage.getItem('roomDescription');
    if (storedHotelName && storedRoomName && storedRoomPrice) {
      this.room = {
        name: storedRoomName,
        price: Number(storedRoomPrice),
        description: storedRoomDescription!,
      };
      this.store.select('hotels').subscribe((state) => {
        this.hotel = state.hotels.find((h) => h.name === storedHotelName);
      });
    }
    this.loggedInUser$.subscribe((loggedInUser) => {
      if (loggedInUser) {
        this.firstName = loggedInUser[0].user.firstName;
        this.lastName = loggedInUser[0].user.lastName;
      } else {
        console.log(Error);
      }
    });
    this.store.select(selectSearchResult).subscribe((searchResult) => {
      if (searchResult.length > 0) {
        this.checkInDate = searchResult[0].checkIn;
        this.checkOutDate = searchResult[0].checkOut;
        this.roomsGuests = searchResult[0].roomsGuests;
      }
      this.calculateTotalPrice();
    });
  }
  calculateTotalPrice() {
    let numberOfGuests = 0;
    if (this.roomsGuests) {
      const [rooms, adults, children] = this.roomsGuests.split(',');
      numberOfGuests = parseInt(adults) + parseInt(children);
    }

    const checkInDate = new Date(this.checkInDate);
    const checkOutDate = new Date(this.checkOutDate);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const numberOfDays = timeDiff / (1000 * 3600 * 24);

    const basePrice = this.room?.price || 0 * numberOfGuests * numberOfDays;
    const taxAmount = basePrice * this.tax;
    this.totalPrice = basePrice + taxAmount + this.serviceFee;
  }

  onCheckout() {
    this.http
      .post('http://localhost:8000/checkout', {
        name: `${this.firstName} ${this.lastName}'s Payment`,
        amount: this.totalPrice,
        roomName: this.room?.name,
        roomPhoto: this.hotel?.photos[0],
        hotelName: this.hotel?.name,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(this.stripeKey);
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
}
