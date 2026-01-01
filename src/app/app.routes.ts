import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegistroPage } from './pages/registro-page/registro-page';
import { HomePage } from './pages/home-page/home-page';
import { AdminCategorias } from './pages/admin-categorias/admin-categorias';
import { EmpresaGestion } from './pages/empresa-gestion/empresa-gestion';
import { PublicarJuegoComponent } from './pages/publicar-juego/publicar-juego';
import { PerfilGamerComponent } from './pages/perfil-gamer/perfil-gamer';
import { PerfilEmpresaComponent } from './pages/perfil-empresa/perfil-empresa';
import { BibliotecaComponent } from './pages/biblioteca/biblioteca';
import { JuegoDetalleComponent } from './pages/juego-detalle/juego-detalle';
import { AdminReportesComponent } from './pages/admin-reportes/admin-reportes';
import { EmpresaVentasComponent } from './pages/empresa-ventas/empresa-ventas';
import { GrupoFamiliarComponent } from './pages/grupo-familiar/grupo-familiar';
import { PerfilPublicoComponent } from './pages/perfil-publico/perfil-publico';
import { AdminEmpresas } from './pages/admin-empresas/admin-empresas';
import { AdminConfiguracion } from './pages/admin-configuracion/admin-configuracion';
import { AdminBanner } from './pages/admin-banner/admin-banner';
import { EmpresaReportesComponent } from './pages/empresa-reportes/empresa-reportes';

export const routes: Routes = 
[
    { path: 'login', component: LoginPage },
    { path: 'registro', component: RegistroPage },
    { path: 'home', component: HomePage },
    { path: 'publicar', component: PublicarJuegoComponent },
    { path: 'admin/categorias', component: AdminCategorias },
    { path: 'empresa/dashboard', component: EmpresaGestion },
    { path: 'mi-perfil', component: PerfilGamerComponent },
    { path: 'ver-empresa/:id', component: PerfilEmpresaComponent },
    { path: 'mi-biblioteca', component: BibliotecaComponent },
    { path: 'juego/:id', component: JuegoDetalleComponent },
    { path: 'reportes-admin', component: AdminReportesComponent },
    { path: 'mis-ventas', component: EmpresaVentasComponent },
    { path: 'mi-grupo', component: GrupoFamiliarComponent },
    { path: 'usuario/:id', component: PerfilPublicoComponent },
    { path: 'empresa/reportes', component: EmpresaReportesComponent },
    { path: 'admin/empresas', component: AdminEmpresas },
    { path: 'admin/config', component: AdminConfiguracion },
    { path: 'admin/banner', component: AdminBanner },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];