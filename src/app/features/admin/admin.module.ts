import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { HotelFormComponent } from './components/hotel-form/hotel-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AdminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
    {
        path: '',
        component: AdminDashboardComponent,
        canActivate: [AdminGuard],
        children: [
            { path: '', redirectTo: 'hotels', pathMatch: 'full' },
            { path: 'hotels', component: HotelListComponent },
            { path: 'hotels/add', component: HotelFormComponent },
            { path: 'hotels/edit/:id', component: HotelFormComponent },
            { path: 'users', component: UserListComponent }
        ]
    }
];

@NgModule({
    declarations: [
        AdminDashboardComponent,
        HotelListComponent,
        HotelFormComponent,
        UserListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AdminModule { } 