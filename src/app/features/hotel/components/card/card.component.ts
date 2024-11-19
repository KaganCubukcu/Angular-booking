import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelDataModel } from '../../store/hotel.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() hotel!: HotelDataModel;
  @Output() bookNowClick = new EventEmitter<string>();

  hotelBackgroundPhoto?: string;

  constructor() {}

  ngOnInit(): void {  
    this.hotelBackgroundPhoto = this.hotel?.cardBackground;
  }

  onBookNowClick() {
    this.bookNowClick.emit(this.hotel?.name);
  }
}
