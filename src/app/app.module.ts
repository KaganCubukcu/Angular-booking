import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HotelListingComponent } from './pages/hotel/hotel-listing/hotel-listing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HotelModule } from './features/hotel/hotel.module';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from './features/auth/auth.module';
import { AccountModule } from './features/account/account.module';
import { AccountComponent } from './features/account/components/account.component';
import { HotelDetailsComponent } from './pages/hotel/hotel-details/hotel-details.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { SuccessPageComponent } from './pages/payment/success-page/success-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangelogComponent } from './features/changelog/changelog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HotelListingComponent,
    AccountComponent,
    HotelDetailsComponent,
    PaymentComponent,
    SuccessPageComponent,
    ChangelogComponent,
  ],
  imports: [
    AccountModule,
    AuthModule,
    SharedModule,
    HotelModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
