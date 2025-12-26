import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService
{
  private readonly API_URL = 'http://localhost:8080/TiendaVideojuegos/api/usuarios/empresa';

  constructor(private http: HttpClient) { }

  listarEmpleados(idEmpresa: number): Observable<any[]> 
  {
    return this.http.get<any[]>(`${this.API_URL}/${idEmpresa}/empleados`);
  }

  agregarEmpleado(idEmpresa: number, empleado: any): Observable<any> 
  {
    return this.http.post(`${this.API_URL}/${idEmpresa}/empleado`, empleado, { responseType: 'text' });
  }

  eliminarEmpleado(idEmpresa: number, idEmpleado: number): Observable<any> 
  {
    return this.http.delete(`${this.API_URL}/${idEmpresa}/empleado/${idEmpleado}`, { responseType: 'text' });
  }
}