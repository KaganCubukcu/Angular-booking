import { Component } from '@angular/core';

@Component({
    selector: 'app-bookings-info',
    template: `
    <!-- Template Start -->
    <div class="booking-container">
      <div class="booking-header">
        <p class="bookings">Bookings</p>
      </div>
      <div class="stays-header">
        <div class="stays-content">
          <div class="bed-icon">
            <img
              alt=""
              class=""
              src="https://static.overlay-tech.com/assets/0226be85-3491-4b4d-ba32-c55913fd6481.svg"
            />
          </div>
          <span class="stays">Stays</span>
        </div>
      </div>

      <div class="stays-info-container">
        <div class="hotel-logo">
          <img
            alt=""
            class=""
            src="https://static.overlay-tech.com/assets/0929e3e1-5b55-46c9-ac4e-65f092de6860.png"
          />
        </div>
        <div class="booking-info">
          <div class="check-in-info">
            <p class="check-in">Check-In</p>
            <p class="date">Thur, Dec 8</p>
          </div>
          <p class="spread">—</p>
          <div class="check-in-info">
            <p class="check-in">Check Out</p>
            <p class="date">Fri, Dec 9</p>
          </div>

          <span class="line"></span>

          <div class="check-in-time-container">
            <div class="check-in-time-two">
              <div class="check-in-time-content">
                <p class="check-in-time">Check-In time</p>
                <p>12:00pm</p>
              </div>
            </div>
            <div class="check-in-time-two">
              <div class="check-in-time-content">
                <p class="check-in-time">Check-In out</p>
                <p>11:30am</p>
              </div>
            </div>
            <div class="stays-content">
              <div class="check-in-time-content">
                <p class="check-in-time">Room no.</p>
                <p>On arrival</p>
              </div>
            </div>
          </div>
        </div>
        <button>Download Ticket</button>
      </div>
    </div>
    <!-- Template End -->
  `,
    styleUrls: ['./bookings-info.component.css'],
    
})
export class BookingsInfoComponent {}
