import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UsuarioGamer } from '../../../models/usuario-gamer';

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-page.html',
  styleUrls: ['./registro-page.css']
})
export class RegistroPage 
{
  gamer: UsuarioGamer = 
  {
    correo: '',
    contraseña: '', 
    rol: 'GAMER',
    nickname: '',
    fechaNacimiento: '',
    telefono: '',
    pais: '',
    saldoCartera: 0.00
  };

  contrasena: string = '';
  confirmarContrasena: string = '';
  error: string = '';
  success: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegistro(): void 
  {
    if (this.contrasena !== this.confirmarContrasena) 
    {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.gamer.contraseña = this.contrasena;
    this.error = '';
    this.success = '';

    this.authService.registrarGamer(this.gamer).subscribe
    (
      {
        next: (respuesta) => 
        {
          console.log('Registro exitoso:', respuesta);
          this.success = '¡Cuenta creada con éxito! Volviendo al login...';
          setTimeout(() => 
          {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => 
        {
          console.error('Error en registro:', err);
          this.error = err.error || 'Error al registrar el usuario. Verifique los datos.';
        }
    });
  }
}