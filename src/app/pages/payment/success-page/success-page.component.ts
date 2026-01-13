import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-success-page',
    template: `
    <!-- Template Start -->
    <div class="container">
      <div class="success">
        <img src="assets/icons/success-icon.svg" alt="Success-Icon" />
        <h1>Payment Successful!</h1>
        <p>
          Your reservation has been confirmed! You will receive a confirmation
          email shortly with all the details of your booking. We look forward to
          welcoming you to our hotel and hope you enjoy your stay with us.
        </p>
      </div>
      <span class="direct-homepage"
        >You are being redirected to the homepage...
      </span>
    </div>

    <!-- Template End -->
  `,
    styleUrls: ['./success-page.component.css'],
    standalone: false
})
export class SuccessPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }
}
