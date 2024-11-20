import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PublicGuard } from '@core/guards/public.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [PublicGuard],
    canActivateChild: [PublicGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' }
      },
      {
        path: 'signup',
        component: SignUpComponent,
        data: { title: 'Sign Up' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }