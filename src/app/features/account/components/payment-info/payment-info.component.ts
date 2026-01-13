import { Component } from '@angular/core';

@Component({
    selector: 'app-payment-info',
    template: `
    <!-- Template Start -->
    <p class="payment-methods">Payment methods</p>
    <div class="payments-card-container">
      <div class="card-item-container">
        <div class="card-content">
          <div class="card-number">
            <p class="card-number-secret">**** **** ****</p>
            <p class="number-show">4321</p>
          </div>
          <img
            alt=""
            class="bin"
            src="https://static.overlay-tech.com/assets/796f3c41-73a6-4351-9d73-4cba299fd8e3.svg"
          />
        </div>
        <div class="exp-date">
          <div class="valid">
            <p class="valid-thru">Valid Thru</p>
            <p class="valid-date">02/27</p>
          </div>
          <img
            alt=""
            class="vector"
            src="https://static.overlay-tech.com/assets/383101e9-6b08-4891-a13d-1574fb9771c6.svg"
          />
        </div>
      </div>
      <div class="add-new-card-container">
        <img src="assets/icons/plus-circle.svg" alt="" />
        <button class="add-a-new-card">Add a new card</button>
      </div>
    </div>

    <!-- Template End -->
  `,
    styleUrls: ['./payment-info.component.css'],
    standalone: false
})
export class PaymentInfoComponent {}
