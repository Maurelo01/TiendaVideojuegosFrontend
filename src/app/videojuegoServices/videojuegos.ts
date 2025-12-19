import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego } from '../../models/videojuego';

@Injectable({
  providedIn: 'root'
})
export class Videojuegos 
{
  private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/videojuegos';

  constructor(private http: HttpClient) { }

  obtenerJuegos(): Observable<Videojuego[]> 
  {
    return this.http.get<Videojuego[]>(this.API_URL);
  }
}