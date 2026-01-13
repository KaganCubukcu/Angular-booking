import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../pages/home/home.component';
import { HotelListingComponent } from '../../pages/hotel-listing/hotel-listing.component';
import { HotelDetailsComponent } from '../../pages/hotel-details/hotel-details.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'hotel-listing', component: HotelListingComponent },
    { path: 'hotel-listing/:name', component: HotelDetailsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HotelRoutingModule { }
