import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegistroPage } from './pages/registro-page/registro-page';
import { HomePage } from './pages/home-page/home-page';
import { PublicarJuegoComponent } from './pages/publicar-juego/publicar-juego';

export const routes: Routes = [
    { path: 'login', component: LoginPage },
    { path: 'registro', component: RegistroPage },
    { path: 'home', component: HomePage },
    { path: 'publicar', component: PublicarJuegoComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];