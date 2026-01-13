import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from '../../pages/payment/payment.component';
import { SuccessPageComponent } from '../../pages/payment/success-page/success-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingModule } from '../booking/booking.module';

const routes: Routes = [
    { path: '', component: PaymentComponent },
    { path: 'success', component: SuccessPageComponent }
];

@NgModule({
    declarations: [PaymentComponent, SuccessPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        BookingModule,
        RouterModule.forChild(routes)
    ]
})
export class PaymentModule { }
