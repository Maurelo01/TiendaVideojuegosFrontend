import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario';

@Injectable({ providedIn: 'root' })
export class ComentariosService 
{
    private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/comentarios';
    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(private http: HttpClient) { }

    listarComentarios(idJuego: number): Observable<Comentario[]>
    {
        return this.http.get<Comentario[]>(`${this.API_URL}/juego/${idJuego}`);
    }

    publicarComentario(comentario: Comentario): Observable<any>
    {
        return this.http.post(this.API_URL, comentario, this.httpOptions);
    }

    editarComentario(id: number, comentario: Comentario): Observable<any>
    {
        return this.http.put(`${this.API_URL}/${id}`, comentario, this.httpOptions);
    }

    eliminarComentario(idComentario: number, idUsuario: number): Observable<any>
    {
        return this.http.delete(`${this.API_URL}/${idComentario}/usuario/${idUsuario}`);
    }
}