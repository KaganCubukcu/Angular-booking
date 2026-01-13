import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HotelListingComponent } from './pages/hotel-listing/hotel-listing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { HotelModule } from './features/hotel/hotel.module';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from './features/auth/auth.module';
import { AccountModule } from './features/account/account.module';
import { AccountComponent } from './pages/account/account.component';
import { HotelDetailsComponent } from './pages/hotel-details/hotel-details.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { SuccessPageComponent } from './pages/payment/success-page/success-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangelogComponent } from './features/changelog/changelog.component';
import { BookingModule } from './features/booking/booking.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        HotelListingComponent,
        LoginComponent,
        SignUpComponent,
        AccountComponent,
        HotelDetailsComponent,
        PaymentComponent,
        SuccessPageComponent,
        ChangelogComponent,
    ],
    bootstrap: [AppComponent], imports: [AccountModule,
        AuthModule,
        SharedModule,
        HotelModule,
        BrowserModule,
        AppRoutingModule,
        StoreModule.forRoot({}, {}),
        EffectsModule.forRoot([]),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: !isDevMode(),
        }),
        NgbModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        BookingModule], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
