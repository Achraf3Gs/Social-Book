import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {ActivateAccountComponent} from './pages/activate-account/activate-account.component';
import {MainComponent} from './modules/book/pages/main/main.component';
import {BookListComponent} from './modules/book/pages/book-list/book-list.component';
import {authGuard} from './services/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },{
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'activate-account',
    component: ActivateAccountComponent,
  },
  {
    path: 'books',
    loadChildren: () => import('./modules/book/book.routes').then((m) => m.bookRoutes),
    canActivate:[authGuard]
  }

];
