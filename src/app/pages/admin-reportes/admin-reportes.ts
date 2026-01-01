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
  rankingCompradores: any[] = [];
  rankingReviewers: any[] = [];
  vistaActual: string = 'global';

  constructor(private comprasService: ComprasService) {}

  ngOnInit(): void 
  {
    this.generarReporte();
  }

  generarReporte()
  {
    this.vistaActual = 'global';
    this.comprasService.obtenerReporteAdmin(this.fechaInicio, this.fechaFin).subscribe
    (
        data => 
        {
            this.reporte = data;
            this.calcularTotales();
        }
    );
  }

  cargarRankings() 
  {
    this.vistaActual = 'ranking';
    this.comprasService.obtenerRankingCompradores().subscribe
    (
        data => this.rankingCompradores = data,
        error => console.error('Error cargando compradores', error)
    );
    this.comprasService.obtenerRankingReviewers().subscribe
    (
        data => this.rankingReviewers = data,
        error => console.error('Error cargando reviewers', error)
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