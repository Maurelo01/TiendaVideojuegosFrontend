import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SolicitudGrupo
{
    idLider?: number;
    nombreGrupo?: string;
    idGrupo?: number;
    idUsuarioMiembro?: number;
    nicknameMiembro?: string;
}

export interface MiembroGrupo
{
    idUsuario: number;
    nickname: string;
    avatar?: string;
}

export interface GrupoFamiliar
{
    idGrupo: number;
    nombreGrupo: string;
    idLider: number;
    nombreLider: string;
    totalMiembros: number;
    miembros: MiembroGrupo[];
}

@Injectable({
    providedIn: 'root'
})
export class GruposService
{
    private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/grupos';
    
    private httpOptions = 
    {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    crearGrupo(solicitud: SolicitudGrupo): Observable<any>
    {
        return this.http.post(this.API_URL, solicitud, this.httpOptions);
    }

    obtenerMiGrupo(idUsuario: number): Observable<GrupoFamiliar>
    {
        return this.http.get<GrupoFamiliar>(`${this.API_URL}/usuario/${idUsuario}`);
    }

    agregarMiembro(solicitud: SolicitudGrupo): Observable<any>
    {
        return this.http.post(`${this.API_URL}/miembros/agregar`, solicitud, this.httpOptions);
    }

    expulsarMiembro(solicitud: SolicitudGrupo): Observable<any>
    {
        return this.http.post(`${this.API_URL}/miembros/expulsar`, solicitud, this.httpOptions);
    }

    eliminarGrupo(idGrupo: number, idLider: number): Observable<any>
    {
        let params = new HttpParams().set('idLider', idLider.toString());
        return this.http.delete(`${this.API_URL}/${idGrupo}`, { params: params });
    }
}