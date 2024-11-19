import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../layout/header/header.component';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { LogoPipe } from './pipes/logo.pipe';
import { FormErrorDirective } from './directives/form-error.directive';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { FooterSectionComponent } from '../layout/footer/footer-section/footer-section.component';
import { CollapsibleSectionComponent } from '../layout/footer/collapsible-section/collapsible-section.component';
@NgModule({
  declarations: [
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    LogoPipe,
    FormErrorDirective,
    DateFormatPipe,
    CollapsibleSectionComponent,
    FooterSectionComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    LogoPipe,
    FormErrorDirective,
    DateFormatPipe,
    CollapsibleSectionComponent,
    FooterSectionComponent,
  ],
})
export class SharedModule {}
