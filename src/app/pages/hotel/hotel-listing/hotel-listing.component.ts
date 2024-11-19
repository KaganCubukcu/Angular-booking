import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { AppStateInterface } from '@core/models/app-state.model';
import { HotelDataModel } from '@features/hotel/store/hotel.model';
import { errorSelector, selectAllHotels, isLoadingSelector } from '@features/hotel/store/hotels.selectors';
import { ErrorState } from '@features/hotel/store/hotel.model';

interface HotelListingData {
  isLoading$: Observable<boolean>;
  error$: Observable<ErrorState | null>;
  hotels$: Observable<HotelDataModel[]>;
  hotelCount: number;
  motelCount: number;
  resortCount: number;
  totalCount: number;
}

@Component({
  selector: 'app-hotel-listing',
  templateUrl: './hotel-listing.component.html',
  styleUrls: ['./hotel-listing.component.css'],
})
export class HotelListingComponent implements OnInit {
  data: HotelListingData = {
    isLoading$: this.store.pipe(select(isLoadingSelector)),
    error$: this.store.pipe(select(errorSelector)),
    hotels$: this.store.pipe(select(selectAllHotels)),
    hotelCount: 0,
    motelCount: 0,
    resortCount: 0,
    totalCount: 0
  };

  constructor(private readonly store: Store<AppStateInterface>) {}

  ngOnInit() {
    this.data.hotels$.pipe(
      map(hotels => ({
        hotelCount: hotels.filter(hotel => hotel.accommodationType === 'hotel').length,
        motelCount: hotels.filter(hotel => hotel.accommodationType === 'motel').length,
        resortCount: hotels.filter(hotel => hotel.accommodationType === 'resort').length,
        totalCount: hotels.length
      }))
    ).subscribe(counts => {
      this.data = {
        ...this.data,
        ...counts
      };
    });
  }
}
