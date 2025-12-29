import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SolicitudCompra
{
    idUsuario: number;
    idJuego: number;
    fechaSimulada?: string;
}

export interface RespuestaCompra 
{
    mensaje: string;
}

export interface RespuestaVerificacion
{
    yaLoTiene: boolean;
}

export interface ReporteVentasEmpresa
{
    tituloJuego: string;
    copiasVendidas: number;
    ingresosBrutos: number;
    comisionPlataforma: number;
    gananciaNeta: number;
}

export interface ReporteAdmin
{
    nombreEmpresa: string;
    totalVentas: number;
    totalIngresos: number;
    gananciaPlataforma: number;
    gananciaEmpresa: number;
}

@Injectable({
    providedIn: 'root'
})
export class ComprasService 
{
    private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/ventas';

    constructor(private http: HttpClient) { }

    private httpOptions =
        {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

    realizarCompra(solicitud: SolicitudCompra): Observable<RespuestaCompra> 
    {
        return this.http.post<RespuestaCompra>(`${this.API_URL}/comprar`, solicitud, this.httpOptions);
    }

    verificarPropiedad(idUsuario: number, idJuego: number): Observable<RespuestaVerificacion>
    {
        return this.http.get<RespuestaVerificacion>(`${this.API_URL}/verificar/${idUsuario}/${idJuego}`);
    }

    obtenerReporteAdmin(inicio: string, fin: string): Observable<ReporteAdmin[]>
    {
        let params = new HttpParams();
        if (inicio) params = params.set('inicio', inicio);
        if (fin) params = params.set('fin', fin);

        return this.http.get<ReporteAdmin[]>(`${this.API_URL}/reporte/admin`, { params });
    }

    obtenerReporteEmpresa(idEmpresa: number, inicio: string, fin: string): Observable<ReporteVentasEmpresa[]>
    {
        let params = new HttpParams();
        if (inicio) params = params.set('inicio', inicio);
        if (fin) params = params.set('fin', fin);

        return this.http.get<ReporteVentasEmpresa[]>(`${this.API_URL}/reporte/empresa/${idEmpresa}`, { params });
    }
}