import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';

export const routes: Routes = [
    { path: 'login', component: LoginPage },
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Por defecto ir al login
    { path: 'home', component: LoginPage } // Temporal, luego crearemos HomePage
];