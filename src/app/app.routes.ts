import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegistroPage } from './pages/registro-page/registro-page';
import { HomePage } from './pages/home-page/home-page';
import { AdminCategorias } from './pages/admin-categorias/admin-categorias';
import { EmpresaGestion } from './pages/empresa-gestion/empresa-gestion';
import { PublicarJuegoComponent } from './pages/publicar-juego/publicar-juego';
import { PerfilGamerComponent } from './pages/perfil-gamer/perfil-gamer';
import { PerfilEmpresaComponent } from './pages/perfil-empresa/perfil-empresa';
import { AdminEmpresas } from './pages/admin-empresas/admin-empresas';
import { AdminConfiguracion } from './pages/admin-configuracion/admin-configuracion';

export const routes: Routes = [
    { path: 'login', component: LoginPage },
    { path: 'registro', component: RegistroPage },
    { path: 'home', component: HomePage },
    { path: 'publicar', component: PublicarJuegoComponent },
    { path: 'admin/categorias', component: AdminCategorias },
    { path: 'empresa/dashboard', component: EmpresaGestion },
    { path: 'mi-perfil', component: PerfilGamerComponent },
    { path: 'ver-empresa/:id', component: PerfilEmpresaComponent },
    { path: 'admin/empresas', component: AdminEmpresas },
    { path: 'admin/config', component: AdminConfiguracion },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];