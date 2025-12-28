import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
}