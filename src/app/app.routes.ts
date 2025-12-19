import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegistroPage } from './pages/registro-page/registro-page';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
    { path: 'login', component: LoginPage },
    { path: 'registro', component: RegistroPage },
    { path: 'home', component: HomePage },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: LoginPage }
];