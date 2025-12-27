import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioGamer } from '../../models/usuario-gamer';
// import { Empresa } from '../../models/empresa'; 

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
}