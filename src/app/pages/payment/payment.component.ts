import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadStripe } from '@stripe/stripe-js';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { loggedInUserSelector } from 'src/app/features/auth/store/auth.selectors';
import { selectSearchResult } from 'src/app/features/hotel/store/search/search.selector';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-payment',
  template: `
    <!-- Template Start -->
    <app-navbar class="active"></app-navbar>
    <div class="payment-container">
      <div class="payment-info-container">
        <!-- Room information section -->
        <div class="room-info">
          <div class="room-details">
            <h2 class="room-name">{{ room?.name }}</h2>
            <p class="room-description">{{ room?.description }}</p>
          </div>
          <div class="room-price">
            <p class="price-per-night">{{ room?.price | currency }}/night</p>
          </div>
        </div>

        <!-- Hotel information section -->
        <div class="hotel-info">
          <div class="hotel-name">{{ hotel.name }}</div>
          <div class="hotel-address">
            <img src="/assets/icons/location.svg" alt="" />
            <span>
              {{ hotel.address.streetAddress }},{{ hotel.address.city }},{{
                hotel.address.country
              }}</span
            >
          </div>
        </div>

        <!-- Check-in and check-out section -->
        <div class="check-in-out">
          <div class="check-in">
            <p class="check-in-label">Check-in</p>
            <span class="check-in-date">{{ checkInDate }}</span>
          </div>
          <div class="hotel-photo">
            <img class="photo" src="/assets/icons/hotel.svg" alt="" />
          </div>
          <div class="check-out">
            <p class="check-out-label">Check-out</p>
            <span class="check-out-date">{{ checkOutDate }}</span>
          </div>
        </div>

        <ng-container
          *ngIf="loggedInUser$ | async as loggedInUser; else notLoggedIn"
        >
          <div class="credit-card">
            <div class="credit-card__logo">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png?20170118154621"
                alt=""
              />
            </div>
            <div class="credit-card__number">
              <span> **** **** **** ****</span>
            </div>
            <div class="credit-card__info">
              <div class="credit-card__name">
                {{ firstName }} {{ lastName }}
              </div>
              <div class="credit-card__expiry">04/24</div>
            </div>
          </div>
        </ng-container>

        <ng-template #notLoggedIn>
          <div class="login-signup-container">
            <span class="login-signup-text">Login or Sign up</span>
            <button class="login-button" routerLink="/login">Login</button>
            <button class="signup-button" routerLink="/sign-up">Sign up</button>
          </div>
        </ng-template>
      </div>
      <div class="card-container">
        <div class="card-hotel-card">
          <div class="card-hotel-image-info">
            <img
              [src]="hotel.photos[0]"
              alt="hotel-image"
              class="card-hotel-image"
            />
            <div class="card-hotel-info">
              <p class="card-hotel-name">{{ hotel?.name }}</p>
              <p class="card-hotel-room-name">{{ room?.name }}</p>
              <section class="card-hotel-rating">
                <span class="rating-score">{{ hotel.rating }}</span>
                <span class="rating-text"
                  ><strong>Very good</strong> 54 reviews</span
                >
              </section>
            </div>
          </div>

          <div class="price-details">
            <h4>Price Details</h4>
            <table>
              <tbody>
                <tr>
                  <td>Base Fare</td>
                  <td>{{ room.price | currency }}</td>
                </tr>
                <tr>
                  <td>Discount</td>
                  <td>{{ discount | currency }}</td>
                </tr>
                <tr>
                  <td>Taxes</td>
                  <td>{{ tax | currency }}</td>
                </tr>
                <tr>
                  <td>Service Fee</td>
                  <td>{{ serviceFee | currency }}</td>
                </tr>
                <tr class="total">
                  <td>Total</td>
                  <td>{{ totalPrice | currency }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-container
            *ngIf="loggedInUser$ | async as loggedInUser; else notLoggedInPay"
          >
            <div class="pay-button-container">
              <button #payButton (click)="onCheckout()">Pay Now</button>
            </div>
          </ng-container>

          <ng-template #notLoggedInPay> </ng-template>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
    <!-- Template End -->
  `,
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  room: any;
  hotel: any;
  firstName: string = '';
  lastName: string = '';
  discount: number = 0;
  tax: number = 0.18;
  serviceFee: number = 5;
  totalPrice: number = 0;
  paymentHandler: any = null;
  loggedInUser$ = this.store.select(loggedInUserSelector);
  checkInDate: string = '';
  checkOutDate: string = '';
  roomsGuests: string = '';

  constructor(
    private store: Store<AppStateInterface>,
    private http: HttpClient
  ) {}
  stripeKey = environment.stripeKey;

  ngOnInit() {
    const storedHotelName = localStorage.getItem('hotelName');
    const storedRoomName = localStorage.getItem('roomName');
    const storedRoomPrice = localStorage.getItem('roomPrice');
    if (storedHotelName && storedRoomName && storedRoomPrice) {
      this.room = {
        name: storedRoomName,
        price: Number(storedRoomPrice),
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

    // Calculate the number of days between checkInDate and checkOutDate
    const checkInDate = new Date(this.checkInDate);
    const checkOutDate = new Date(this.checkOutDate);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const numberOfDays = timeDiff / (1000 * 3600 * 24);

    // Calculate the total price
    const basePrice = this.room.price * numberOfGuests * numberOfDays;
    const taxAmount = basePrice * this.tax;
    this.totalPrice = basePrice + taxAmount + this.serviceFee;
  }

  onCheckout() {
    this.http
      .post('http://localhost:8000/checkout', {
        name: `${this.firstName} ${this.lastName}'s Payment`,
        amount: this.totalPrice,
        roomName: this.room.name,
        roomPhoto: this.hotel.photos[0],
        hotelName: this.hotel.name,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(this.stripeKey);
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
}
