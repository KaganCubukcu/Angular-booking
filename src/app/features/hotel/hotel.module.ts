import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { ContentComponent } from './components/content/content.component';
import { FiltersCardComponent } from './components/filters-card/filters-card.component';
import { HotelsFiltersComponent } from './components/hotels-filters/hotels-filters.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { HotelsEffects } from './store/hotels.effects';
import { StoreModule } from '@ngrx/store';
import { hotelReducer } from './store/hotels.reducers';
import { localStorageSync } from 'ngrx-store-localstorage';
import { searchBarReducer } from './store/search/search.reducers';

@NgModule({
  declarations: [
    CardComponent,
    ContentComponent,
    FiltersCardComponent,
    HotelsFiltersComponent,
    NewsletterComponent,
    SearchBarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    NewsletterComponent,
    FiltersCardComponent,
    HotelsFiltersComponent,
  ],
})
export class HotelModule {}
