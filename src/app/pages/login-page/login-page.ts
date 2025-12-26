import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SolicitudLogin } from '../../../models/solicitud-login'

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage 
{
  correo: string = '';
  contrasena: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void 
  {
    this.error = '';
    const credenciales: SolicitudLogin = 
    {
      correo: this.correo,
      contraseña: this.contrasena
    };

    this.authService.login(credenciales).subscribe
    (
      {
      next: (usuarioRecibido) => 
      {
        console.log('Login exitoso:', usuarioRecibido);
        this.authService.guardarSesion(usuarioRecibido);
        this.router.navigate(['/home']); 
      },
      error: (err) => 
      {
        console.error('Error de login:', err);
        if (err.error) 
        {
            this.error = err.error; 
        }
        else 
        {
            this.error = 'Credenciales incorrectas o error de conexión.';
        }
      }
    });
  }
}