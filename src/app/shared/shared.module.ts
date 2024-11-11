import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { LogoPipe } from './pipe/logo.pipe';
import { FormErrorDirective } from './directives/form-error.directive';
import { DateFormatPipe } from './pipe/date-format.pipe';
import { FooterSectionComponent } from '../features/footer/footer-section/footer-section.component';
import { CollapsibleSectionComponent } from '../features/footer/collapsible-section/collapsible-section.component';
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
