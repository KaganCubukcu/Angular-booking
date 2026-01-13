import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HotelDataModel } from '../../store/hotel.model';
import { select, Store } from '@ngrx/store';
import { AppStateInterface } from '../../../../core/models/app-state.model';
import {
  errorSelector,
  hotelsSelector,
  isLoadingSelector,
} from '../../store/hotels.selectors';
import { Router } from '@angular/router';
import slugify from 'slugify';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.css'],
    
})
export class ContentComponent {
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  hotels$: Observable<HotelDataModel[]>;

  constructor(private readonly store: Store<AppStateInterface>, private readonly router: Router) {
    this.error$ = this.store.pipe(select(errorSelector));
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.hotels$ = this.store.pipe(select(hotelsSelector));
  }

  onHotelBookNowClick(hotelName: string) {
    const slug = slugify(hotelName);
    this.router.navigate(['hotel-listing', slug]);
  }
}
