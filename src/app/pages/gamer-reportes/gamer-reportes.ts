import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuarioServices/UsuarioService';

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

  constructor
  (
    private authService: AuthService,
    private usuarioService: UsuarioService,
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
}