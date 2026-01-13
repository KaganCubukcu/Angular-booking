import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelDataModel } from '../../store/hotel.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: false
})
export class CardComponent implements OnInit {
  @Input() hotel!: HotelDataModel;
  @Output() bookNowClick = new EventEmitter<string>();

  hotelBackgroundPhoto?: string;

  ngOnInit(): void {
    this.hotelBackgroundPhoto = this.hotel?.cardBackground;
  }

  onBookNowClick() {
    this.bookNowClick.emit(this.hotel?.name);
  }
}
