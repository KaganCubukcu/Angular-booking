import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HotelDataModel } from '../../features/hotel/store/hotel.model';
import { select, Store } from '@ngrx/store';
import { AppStateInterface } from '../../core/models/app-state.model';
import {
  errorSelector,
  hotelsSelector,
  isLoadingSelector,
} from '../../features/hotel/store/hotels.selectors';

@Component({
  selector: 'app-hotel-listing',
  template: `
    <app-navbar class="active"></app-navbar>
    <div class="hotels-listing-container">
      <!-- <app-hotels-filters></app-hotels-filters> -->
      <app-filters-card [data]="data"></app-filters-card>
    </div>
    <app-footer></app-footer>
  `,
  styleUrls: ['./hotel-listing.component.css'],
})
export class HotelListingComponent implements OnInit {
  data: any;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  hotels$: Observable<HotelDataModel[]>;

  hotelCount: number = 0;
  motelCount: number = 0;
  resortCount: number = 0;
  totalCount: number = 0;

  constructor(private store: Store<AppStateInterface>) {
    this.error$ = this.store.pipe(select(errorSelector));
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.hotels$ = this.store.pipe(select(hotelsSelector));
  }

  ngOnInit() {
    this.hotels$
      .pipe(
        map((hotels) => ({
          hotelCount: hotels.filter(
            (hotel) => hotel.accommodationType === 'hotel'
          ).length,
          motelCount: hotels.filter(
            (hotel) => hotel.accommodationType === 'motel'
          ).length,
          resortCount: hotels.filter(
            (hotel) => hotel.accommodationType === 'resort'
          ).length,
          totalCount: hotels.length,
        }))
      )
      .subscribe(({ hotelCount, motelCount, resortCount, totalCount }) => {
        this.data = {
          isLoading$: this.isLoading$,
          error$: this.error$,
          hotels$: this.hotels$,
          hotelCount: hotelCount,
          motelCount: motelCount,
          resortCount: resortCount,
          totalCount: totalCount,
        };
      });
  }
}
