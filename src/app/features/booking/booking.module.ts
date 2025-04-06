import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { bookingReducer } from './store/booking.reducers';
import { BookingEffects } from './store/booking.effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature('booking', bookingReducer),
        EffectsModule.forFeature([BookingEffects])
    ]
})
export class BookingModule { } 