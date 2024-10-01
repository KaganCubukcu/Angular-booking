import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HotelListingComponent } from './pages/hotel-listing/hotel-listing.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { AccountComponent } from './pages/account/account.component';
import { HotelDetailsComponent } from './pages/hotel-details/hotel-details.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { SuccessPageComponent } from './pages/payment/success-page/success-page.component';
import { ChangelogComponent } from './features/changelog/changelog.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'hotel-listing',
    component: HotelListingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },

  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'hotel-listing/:name',
    component: HotelDetailsComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: 'success',
    component: SuccessPageComponent,
  },
  {
    path: 'changelog',
    component: ChangelogComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
