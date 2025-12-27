import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/adminSevices/admin';
import { Configuracion } from '../../../models/configuracion';

@Component({
  selector: 'app-admin-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-configuracion.html',
  styles: [`.card-config { max-width: 500px; margin: 0 auto; }`]
})
export class AdminConfiguracion implements OnInit
{
  config: Configuracion = { comisionGlobalActual: 0 };
  nuevaComision: number = 0;
  mensaje: string = '';
  error: string = '';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void
  {
    this.cargarDatos();
  }

  cargarDatos() 
  {
    this.adminService.obtenerConfiguracion().subscribe
    (
      {
        next: (data) => 
        {
          this.config = data;
          this.nuevaComision = data.comisionGlobalActual;
        },
        error: (err) => console.error('Error al cargar config', err)
      }
    );
  }

  guardarCambios()
  {
    if (this.nuevaComision < 0 || this.nuevaComision > 100)
    {
      this.error = 'El porcentaje debe estar entre 0 y 100.';
      return;
    }
    const configActualizada: Configuracion = {...this.config, comisionGlobalActual: this.nuevaComision};

    this.adminService.actualizarComision(configActualizada).subscribe
    (
      {
        next: (resp) => 
        {
          this.mensaje = 'Comisión global actualizada. Se han ajustado las empresas automáticamente.';
          this.error = '';
          this.cargarDatos();
        },
        error: (err) => 
        {
          this.error = 'Error al actualizar: ' + (err.error || err.message);
          this.mensaje = '';
        }
      }
    );
  }
}