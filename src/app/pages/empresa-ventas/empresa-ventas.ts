import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprasService } from '../../../services/compras';
import { AuthService } from '../../../services/auth.service';
import { ReporteVentasEmpresa } from '../../../models/reportes';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-empresa-ventas',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './empresa-ventas.html'
})
export class EmpresaVentasComponent implements OnInit 
{
    ventas: ReporteVentasEmpresa[] = [];
    fechaInicio: string = '';
    fechaFin: string = '';
    idEmpresa: number = 0;
    totalGananciaNeta: number = 0;

    constructor
    (
        private comprasService: ComprasService,
        private authService: AuthService
    ) { }

    ngOnInit(): void 
    {
        const usuario = this.authService.obtenerUsuarioActual();
        if (usuario && usuario.rol === 'EMPRESA') {
            this.idEmpresa = usuario.idEmpresa || 0;
            this.generarReporte();
        }
    }

    generarReporte() 
    {
        if (this.idEmpresa === 0) return;
        this.comprasService.obtenerReporteEmpresa(this.idEmpresa, this.fechaInicio, this.fechaFin).subscribe
        (
            data => 
            {
                this.ventas = data;
                this.totalGananciaNeta = this.ventas.reduce((sum, item) => sum + item.gananciaNeta, 0);
            }
        );
    }

    exportarPDF() 
    {
        if (!this.idEmpresa) return;
        this.comprasService.descargarReporteEmpresaPDF(this.idEmpresa, this.fechaInicio, this.fechaFin).subscribe
        (
            {
                next: (data: Blob) => 
                {
                    const url = window.URL.createObjectURL(data);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Reporte_Ventas_Empresa_${this.idEmpresa}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                },
                error: (err) => console.error('Error al descargar PDF de empresa', err)
            }
        );
    }
}