import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegistroPage } from './pages/registro-page/registro-page';

export const routes: Routes = [
    { path: 'login', component: LoginPage },
    { path: 'registro', component: RegistroPage },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: LoginPage }
];