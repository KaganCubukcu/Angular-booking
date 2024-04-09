import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelDataModel } from '../../store/hotel.model';

@Component({
  selector: 'app-card',
  template: `
    <!-- <div
      class="card-container"
      [style.background-image]="'url(' + selectedBackgroundPhoto + ')'"
    >
      <div class="card-content-container">
        <section class="card-content">
          <h6>{{ hotel?.name }}</h6>
          <p>An amazing journey</p>
        </section>
        <div class="card-price-container">
        <section class="card-price">
          <span> {{ hotel?.nightlyPrice | currency }}</span> /night
        </section>
        </div>
      </div>
    </div> -->
    <div>
      <div>Resim</div>
      <div>
        <h6>{{ hotel?.name }}</h6>
        <span>Hotel Address</span>
        <span>Degerlendirme</span>
        <div>
          
          <span>Fiyat</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() hotel: HotelDataModel | undefined;
  // The bookNowClick event is emitted when the user clicks the "Book Now" button
  @Output() bookNowClick = new EventEmitter<string>();

  // The selectedBackgroundPhoto property stores the URL of the photo to be displayed as the card background
  selectedBackgroundPhoto: string | undefined;

  constructor() {}

  // On initialization, set the selectedBackgroundPhoto property to the cardBackground property of the hotel data
  ngOnInit(): void {
    this.selectedBackgroundPhoto = this.hotel?.cardBackground;
  }

  // When the user clicks the "Book Now" button, emit the bookNowClick event with the name of the hotel as its payload
  onBookNowClick() {
    this.bookNowClick.emit(this.hotel?.name);
  }
}
