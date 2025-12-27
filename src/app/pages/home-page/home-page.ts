import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/adminSevices/admin';
import { VideojuegosService } from '../../../services/videojuegoServices/videojuegos';
import { Videojuego } from '../../../models/videojuego';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements OnInit 
{
  juegos: Videojuego[] = [];
  cargando: boolean = true;
  usuarioNombre: string | null = null;
  esEmpresa: boolean = false;
  esAdmin: boolean = false;
  banners: any[] = [];
  juegosDestacados: Videojuego[] = [];
  constructor
  (
    private adminService: AdminService,
    private videojuegosService: VideojuegosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void 
  {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario) 
    {
      this.usuarioNombre = (usuario as any).nickname || usuario.correo;
      if (usuario.rol === 'EMPRESA') 
      {
        this.usuarioNombre = `${usuario.nombreEmpleado} - ${usuario.nombreEmpresaAux}`;
        this.esEmpresa = true;
      }
      else if (usuario.rol === 'ADMIN')
      {
        this.usuarioNombre = 'Administrador';
        this.esAdmin = true;
      }
      else 
      {
        this.usuarioNombre = usuario.nickname || usuario.correo;
      }
    }
    this.cargarCatalogo();
    this.cargarBanners();
    this.cargarJuegos();
  }

  cargarCatalogo(): void 
  {
    this.videojuegosService.obtenerJuegos().subscribe
    (
      {
        next: (data) => 
        {
          this.juegos = data;
          this.cargando = false;
        },
        error: (err) => 
        {
          console.error('Error cargando juegos', err);
          this.cargando = false;
        }
      }
    );
  }

  cargarBanners()
  {
    this.adminService.listarBanners().subscribe
    (
    {
      next: (data) => 
      {
        this.banners = data;
      },
      error: (err) => console.error('Error al cargar banners', err)
    });
  }

  cargarJuegos() 
  {
    this.videojuegosService.obtenerJuegos().subscribe
    (
      {
        next: (data) => 
        {
          this.juegosDestacados = data.slice(0, 6);
        },
        error: (err) => console.error(err)
      }
    );
  }

  cerrarSesion(): void 
  {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}