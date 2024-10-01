import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { LogoPipe } from './pipe/logo.pipe';
import { FormErrorDirective } from './directives/form-error.directive';

@NgModule({
  declarations: [HeaderComponent, NavbarComponent, FooterComponent, LogoPipe, FormErrorDirective],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, NavbarComponent, FooterComponent, LogoPipe],
})
export class SharedModule {}
