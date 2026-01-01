import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprasService } from '../../../services/compras';
import { ReporteAdmin } from '../../../models/reportes';
import { RouterLink } from '@angular/router';
import { VideojuegosService } from '../../../services/videojuegoServices/videojuegos';

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
  topJuegos: any[] = [];
  categorias: any[] = [];
  filtroCategoria: number = 0;
  filtroEdad: string = '';

  constructor
  (
    private comprasService: ComprasService,
    private videojuegosService: VideojuegosService
  ){}

  ngOnInit(): void 
  {
    this.generarReporte();
    this.cargarCategorias();
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

  cargarCategorias()
  {
      this.videojuegosService.obtenerCategorias().subscribe(data => this.categorias = data);
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

  cargarTopJuegos()
  {
      this.vistaActual = 'top';
      this.comprasService.obtenerTopJuegos(this.filtroCategoria, this.filtroEdad).subscribe
      (
        {
          next: (data) => this.topJuegos = data,
          error: (e) => console.error(e)
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
    if (this.vistaActual === 'ranking') 
    {
      this.comprasService.descargarRankingPDF().subscribe
      (
        (data: Blob) => this.descargarArchivo(data, 'Ranking_Usuarios.pdf'),
        error => console.error('Error al descargar Ranking PDF', error)
      );
    }
    else if (this.vistaActual === 'top') 
    {
      this.comprasService.descargarTopJuegosPDF(this.filtroCategoria, this.filtroEdad).subscribe
      (
        (data: Blob) => this.descargarArchivo(data, 'Top_Juegos_Calidad.pdf'),
        error => console.error('Error al descargar Top Juegos PDF', error)
      );
  }
    else 
    {
      this.comprasService.descargarReporteAdminPDF(this.fechaInicio, this.fechaFin).subscribe
      (
        (data: Blob) => this.descargarArchivo(data, 'Reporte_Global_Ventas.pdf'),
        error => console.error('Error al descargar PDF Global', error)
      );
    }
  }

  private descargarArchivo(data: Blob, nombre: string) 
  {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}