import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class AdminService 
{
    private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/admin';

    private httpOptions = 
    {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    listarCategorias(): Observable<Categoria[]> 
    {
        return this.http.get<Categoria[]>(`${this.API_URL}/categorias`);
    }

    crearCategoria(categoria: Categoria): Observable<any> 
    {
        return this.http.post(`${this.API_URL}/categorias`, categoria, { responseType: 'text' });
    }

    editarCategoria(categoria: Categoria, confirmar: boolean = false): Observable<any> 
    {
        let params = new HttpParams();
        if (confirmar) 
        {
            params = params.set('confirmar', 'true');
        }
        return this.http.put(`${this.API_URL}/categorias/${categoria.idCategoria}`, categoria, { params, responseType: 'text' });
    }

    eliminarCategoria(id: number, confirmar: boolean = false): Observable<any> 
    {
        let params = new HttpParams();
        if (confirmar) 
        {
            params = params.set('confirmar', 'true');
        }
        return this.http.delete(`${this.API_URL}/categorias/${id}`, { params, responseType: 'text' });
    }

    listarEmpresas(): Observable<any[]> 
    {
        return this.http.get<any[]>(`${this.API_URL}/empresas`);
    }

    registrarEmpresa(solicitud: any): Observable<any>
    {
        const urlRegistro = 'http://localhost:8080/TiendaVideojuegos/api/usuarios/registro/empresa'; 
        return this.http.post(urlRegistro, solicitud, { ...this.httpOptions, responseType: 'text' });
    }

    editarEmpresa(id: number, empresa: any): Observable<any>
    {
        return this.http.put(`${this.API_URL}/empresas/${id}`, empresa, { ...this.httpOptions, responseType: 'text' });
    }

    suspenderEmpresa(id: number): Observable<any> 
    {
        return this.http.put(`${this.API_URL}/empresas/${id}/suspender`, {}, { responseType: 'text' });
    }
  
    activarEmpresa(id: number): Observable<any> 
    {
        return this.http.put(`${this.API_URL}/empresas/${id}/activar`, {}, { responseType: 'text' });
    }
}