import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioGamer } from '../../models/usuario-gamer';
import { Biblioteca } from '../../models/biblioteca';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService
{
    private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/usuarios';
    private httpOptions = 
    {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    obtenerPerfilGamer(idUsuario: number): Observable<UsuarioGamer>
    {
        return this.http.get<UsuarioGamer>(`${this.API_URL}/gamer/${idUsuario}`);
    }

    actualizarPerfilGamer(idUsuario: number, datos: UsuarioGamer): Observable<any>
    {
        return this.http.put(`${this.API_URL}/gamer/${idUsuario}`, datos, { ...this.httpOptions, responseType: 'text' });
    }

    obtenerPerfilEmpresa(idEmpresa: number): Observable<any>
    {
        return this.http.get<any>(`${this.API_URL}/empresa/publica/${idEmpresa}`);
    }

    recargarSaldo(idUsuario: number, monto: number): Observable<any>
    {
        const body = { monto: monto };
        return this.http.post(`${this.API_URL}/gamer/${idUsuario}/recargar`, body, {headers: new HttpHeaders({ 'Content-Type': 'application/json' })});
    }

    obtenerBiblioteca(idUsuario: number): Observable<Biblioteca[]>
    {
        return this.http.get<Biblioteca[]>(`${this.API_URL}/gamer/${idUsuario}/biblioteca`);
    }

    instalarJuego(idUsuario: number, idJuego: number): Observable<any>
    {
        return this.http.put(`${this.API_URL}/gamer/${idUsuario}/biblioteca/${idJuego}/instalar`, {}, this.httpOptions);
    }

    desinstalarJuego(idUsuario: number, idJuego: number): Observable<any>
    {
        return this.http.put(`${this.API_URL}/gamer/${idUsuario}/biblioteca/${idJuego}/desinstalar`, {}, this.httpOptions);
    }

    obtenerPerfilPublico(idBuscado: number, idSolicitante: number): Observable<any> 
    {
        let params = new HttpParams().set('solicitante', idSolicitante.toString());
        return this.http.get(`${this.API_URL}/${idBuscado}/vista-publica`, { params });
    }

    cambiarPrivacidad(idUsuario: number, esPublico: boolean): Observable<any>
    {
        return this.http.put(`${this.API_URL}/${idUsuario}/privacidad`, { perfilPublico: esPublico });
    }   

    buscarUsuarios(query: string): Observable<any[]>
    {
        let params = new HttpParams().set('q', query);
        return this.http.get<any[]>(`${this.API_URL}/buscar`, { params });
    }

    obtenerAnalisisGamer(idUsuario: number): Observable<any> 
    {
        return this.http.get<any>(`${this.API_URL}/gamer/${idUsuario}/analisis`);
    }
}