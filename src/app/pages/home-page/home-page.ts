import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Videojuegos } from '../../videojuegoServices/videojuegos';
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

  constructor
  (
    private videojuegos: Videojuegos,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void 
  {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario) 
    {
      this.usuarioNombre = (usuario as any).nickname || usuario.correo;
      this.esEmpresa = usuario.rol === 'EMPRESA';
    }
    this.cargarCatalogo();
  }

  cargarCatalogo(): void 
  {
    this.videojuegos.obtenerJuegos().subscribe
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

  cerrarSesion(): void 
  {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}