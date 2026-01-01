import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuarioServices/UsuarioService';
import { PrestamosService } from '../../../services/prestamos';

@Component({
  selector: 'app-gamer-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gamer-reportes.html'
})
export class GamerReportesComponent implements OnInit 
{
  cargando: boolean = true;
  reporte: any = null; // categoriasFavoritas: [], comparativaCalificaciones: []
  idUsuario: number = 0;
  usoFamiliar: any[] = [];
  vistaActual: string = 'analisis'; // analisis o familiar

  constructor
  (
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private prestamosService: PrestamosService,
    private router: Router
  ) { }

  ngOnInit()
  {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario && usuario.rol === 'GAMER' && usuario.idUsuario)
    {
      this.idUsuario = usuario.idUsuario;
      this.cargarDatos();
    }
    else
    {
      this.router.navigate(['/home']);
    }
  }

  cargarDatos()
  {
    this.cargando = true;
    this.usuarioService.obtenerAnalisisGamer(this.idUsuario).subscribe
    (
      {
        next: (data) => 
        {
          this.reporte = data;
          this.cargando = false;
        },
        error: (e) => 
        {
          console.error(e);
          this.cargando = false;
        }
      }
    );
  }

  cambiarVista(vista: string)
  {
    this.vistaActual = vista;
    if (vista === 'familiar')
    {
      this.cargarUsoFamiliar();
    }
    else
    {
      this.cargarDatos();
    }
  }

  cargarUsoFamiliar()
  {
    this.cargando = true;
    this.prestamosService.obtenerReporteUsoFamiliar(this.idUsuario).subscribe
    (
      {
        next: (data) => 
        {
          this.usoFamiliar = data;
          this.cargando = false;
        },
        error: (e) => 
        {
          console.error('Error cargando uso familiar', e);
          this.cargando = false;
        }
      }
    );
  }
}