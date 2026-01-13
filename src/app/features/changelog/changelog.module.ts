import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChangelogComponent } from './changelog.component';

const routes: Routes = [
    { path: '', component: ChangelogComponent }
];

@NgModule({
    declarations: [ChangelogComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class ChangelogModule { }
