import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego } from '../../models/videojuego';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService
{
  private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/videojuegos';

  constructor(private http: HttpClient) { }

  private httpOptions = 
  {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  publicarJuego(juego: Videojuego): Observable<any> 
  {
    return this.http.post(`${this.API_URL}`, juego, { ...this.httpOptions, responseType: 'text'});
  }

  obtenerJuegos(): Observable<Videojuego[]> 
  {
    return this.http.get<Videojuego[]>(this.API_URL);
  }

  obtenerPorEmpresa(idEmpresa: number): Observable<Videojuego[]> 
  {
    return this.http.get<Videojuego[]>(`${this.API_URL}/empresa/${idEmpresa}`);
  }

  suspenderJuego(idJuego: number): Observable<any> 
  {
    return this.http.put(`${this.API_URL}/${idJuego}/suspender`, {}, { responseType: 'text' });
  }

  activarJuego(idJuego: number): Observable<any> 
  {
    return this.http.put(`${this.API_URL}/${idJuego}/activar`, {}, { responseType: 'text' });
  }
}