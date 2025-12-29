import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprasService } from '../../../services/compras';
import { ReporteAdmin } from '../../../models/reportes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-reportes.html'
})
export class AdminReportesComponent implements OnInit 
{
  reporte: ReporteAdmin[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  totalGlobalIngresos: number = 0;
  totalGlobalGanancia: number = 0;

  constructor(private comprasService: ComprasService) {}

  ngOnInit(): void 
  {
    this.generarReporte();
  }

  generarReporte()
  {
    this.comprasService.obtenerReporteAdmin(this.fechaInicio, this.fechaFin).subscribe
    (
        data => 
        {
            this.reporte = data;
            this.calcularTotales();
        }
    );
  }

  calcularTotales()
  {
    this.totalGlobalIngresos = this.reporte.reduce((sum, item) => sum + item.totalIngresos, 0);
    this.totalGlobalGanancia = this.reporte.reduce((sum, item) => sum + item.gananciaPlataforma, 0);
  }

  limpiarFiltros()
  {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.generarReporte();
  }

  exportarPDF() 
  {
    this.comprasService.descargarReporteAdminPDF(this.fechaInicio, this.fechaFin).subscribe
    (
        (data: Blob) => 
        {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Reporte_Global_Ventas.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        },
        error => console.error('Error al descargar PDF', error)
    );
  }
}