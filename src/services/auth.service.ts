import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudLogin } from '../models/solicitud-login.model';
import { Usuario } from '../models/usuario.model';
import { UsuarioGamer } from '../models/usuario-gamer.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{
  private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/usuarios';
  private httpOptions = 
  {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  login(solicitud: SolicitudLogin): Observable<Usuario> 
  {
    return this.http.post<Usuario>(`${this.API_URL}/login`, solicitud, this.httpOptions);
  }

  registrarGamer(gamer: UsuarioGamer): Observable<UsuarioGamer> 
  {
    return this.http.post<UsuarioGamer>(`${this.API_URL}/registro/gamer`, gamer, this.httpOptions);
  }

  guardarSesion(usuario: Usuario): void 
  {
    sessionStorage.setItem('usuario_actual', JSON.stringify(usuario));
  }

  obtenerUsuarioActual(): Usuario | null 
  {
    const usuarioStr = sessionStorage.getItem('usuario_actual');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  logout(): void 
  {
    sessionStorage.removeItem('usuario_actual');
    window.location.reload(); 
  }

  estaLogueado(): boolean 
  {
    return this.obtenerUsuarioActual() !== null;
  }
}