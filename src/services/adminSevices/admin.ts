import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class AdminService 
{
    private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/admin';

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
}