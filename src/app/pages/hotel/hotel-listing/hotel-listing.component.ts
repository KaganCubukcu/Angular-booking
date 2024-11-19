import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { HotelDataModel } from '../../../features/hotel/store/hotel.model';
import { select, Store } from '@ngrx/store';
import { AppStateInterface } from '../../../core/models/app-state.model';
import { errorSelector, hotelsSelector, isLoadingSelector } from '../../../features/hotel/store/hotels.selectors';

interface HotelListingData {
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
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

export class HotelListingComponent implements OnInit, OnDestroy {
  data: HotelListingData = {
    isLoading$: this.store.pipe(select(isLoadingSelector)),
    error$: this.store.pipe(select(errorSelector)),
    hotels$: this.store.pipe(select(hotelsSelector)),
    hotelCount: 0,
    motelCount: 0,
    resortCount: 0,
    totalCount: 0
  };

  unsubscribe$ = new Subject<void>();
  
  constructor(private readonly store: Store<AppStateInterface>) {}

  ngOnInit() {
    this.data.hotels$.pipe(
      takeUntil(this.unsubscribe$),
      map((hotels) => ({
        hotelCount: hotels.filter((hotel) => hotel.accommodationType === 'hotel').length,
        motelCount: hotels.filter((hotel) => hotel.accommodationType === 'motel').length,
        resortCount: hotels.filter((hotel) => hotel.accommodationType === 'resort').length,
        totalCount: hotels.length,
      }))
    ).subscribe(({ hotelCount, motelCount, resortCount, totalCount }) => {
      this.data = {
        ...this.data,
        hotelCount,
        motelCount,
        resortCount,
        totalCount,
      };
    });
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
