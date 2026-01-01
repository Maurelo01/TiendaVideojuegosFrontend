import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ReporteFeedback } from '../../../models/reportes';
import { ComentariosService } from '../../../services/comentarios';

@Component({
  selector: 'app-empresa-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './empresa-reportes.html'
})
export class EmpresaReportesComponent implements OnInit
{
  cargando: boolean = true;
  reporte: ReporteFeedback | null = null;
  idEmpresa: number = 0;

  constructor
  (
    private authService: AuthService,
    private comentariosService: ComentariosService,
    private router: Router
  ) { }

  ngOnInit(): void 
  {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario && usuario.rol === 'EMPRESA' && usuario.idEmpresa)
    {
      this.idEmpresa = usuario.idEmpresa;
      this.cargarDatos();
    }
    else 
    {
      alert('Acceso denegado. Solo para empresas.');
      this.router.navigate(['/home']);
    }
  }

  cargarDatos()
  {
    this.cargando = true;
    this.comentariosService.obtenerReporteFeedback(this.idEmpresa).subscribe
    (
      {
        next: (data) => 
        {
          this.reporte = data;
          this.cargando = false;
        },
        error: (err) => 
        {
          console.error(err);
          this.cargando = false;
        }
      }
    );
  }

  generarEstrellas(calificacion: number): number[]
  {
    return Array(calificacion).fill(0);
  }
}