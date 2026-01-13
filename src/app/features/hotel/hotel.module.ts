import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { ContentComponent } from './components/content/content.component';
import { FiltersCardComponent } from './components/filters-card/filters-card.component';
import { HotelsFiltersComponent } from './components/hotels-filters/hotels-filters.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { HotelsEffects } from './store/hotels.effects';
import { StoreModule } from '@ngrx/store';
import { hotelReducer } from './store/hotels.reducers';
import { localStorageSync } from 'ngrx-store-localstorage';
import { searchBarReducer } from './store/search/search.reducers';
import { AdventureAwaitsComponent } from './components/adventure-awaits/adventure-awaits.component';
import { HotelRoutingModule } from './hotel-routing.module';
import { HomeComponent } from '../../pages/home/home.component';
import { HotelListingComponent } from '../../pages/hotel-listing/hotel-listing.component';
import { HotelDetailsComponent } from '../../pages/hotel-details/hotel-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingModule } from '../booking/booking.module';

@NgModule({
  declarations: [
    CardComponent,
    ContentComponent,
    FiltersCardComponent,
    HotelsFiltersComponent,
    SearchBarComponent,
    AdventureAwaitsComponent,
    HomeComponent,
    HotelListingComponent,
    HotelDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HotelRoutingModule,
    BookingModule,
    EffectsModule.forFeature([HotelsEffects]),
    StoreModule.forFeature('hotels', hotelReducer, {
      metaReducers: [
        localStorageSync({
          keys: ['hotels'],
          rehydrate: true,
        }),
      ],
    }),
    [StoreModule.forFeature('search', searchBarReducer)],
  ],
  exports: [
    SearchBarComponent,
    ContentComponent,
    FiltersCardComponent,
    HotelsFiltersComponent,
    AdventureAwaitsComponent,
  ],
})
export class HotelModule { }
