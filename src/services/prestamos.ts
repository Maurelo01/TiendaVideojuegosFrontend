import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SolicitudPrestamo
{
    idUsuarioSolicitante: number;
    idJuego: number;
    idPropietario: number;
}

@Injectable({
    providedIn: 'root'
})
export class PrestamosService
{
    private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/prestamos';
    private httpOptions = 
    {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) {}

    solicitarPrestamo(solicitud: SolicitudPrestamo): Observable<any>
    {
        return this.http.post(`${this.API_URL}/solicitar`, solicitud, this.httpOptions);
    }

    devolverPrestamo(solicitud: SolicitudPrestamo): Observable<any>
    {
        return this.http.put(`${this.API_URL}/devolver`, solicitud, this.httpOptions);
    }

    obtenerReporteUsoFamiliar(idUsuario: number): Observable<any[]> 
    {
        return this.http.get<any[]>(`${this.API_URL}/reporte/usuario/${idUsuario}`);
    }

    descargarUsoFamiliarPDF(idUsuario: number): Observable<Blob> 
    {
        return this.http.get(`${this.API_URL}/reporte/usuario/${idUsuario}/pdf`, { responseType: 'blob' });
    }
}