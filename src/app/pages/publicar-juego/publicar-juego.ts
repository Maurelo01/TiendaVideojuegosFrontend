import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Videojuegos } from '../../videojuegoServices/videojuegos';
import { AuthService } from '../../../services/auth.service';
import { Videojuego } from '../../../models/videojuego';

@Component({
  selector: 'app-publicar-juego',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicar-juego.html',
  styleUrls: ['./publicar-juego.css']
})
export class PublicarJuegoComponent 
{
  juego: Videojuego = 
  {
    idJuego: 0,
    idEmpresa: 0,
    titulo: '',
    descripcion: '',
    precio: 0,
    recursosMinimos: '',
    clasificacionEdad: 'E',
    estado: 'ACTIVO',
    imagen: ''
  };

  mensajeError: string = '';
  mensajeExito: string = '';
  imagenPrevisualizacion: string | null = null; // Para mostrar la imagen seleccionada

  constructor
  (
    private videojuegos: Videojuegos, 
    private authService: AuthService,
    private router: Router
  ) 
  {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario && usuario.rol === 'EMPRESA') 
    {
      this.juego.idEmpresa = usuario.idUsuario || 0; 
    }
    else 
    {
      this.router.navigate(['/home']);
    }
  }

  onFileSelected(event: any): void 
  {
    const archivo = event.target.files[0];  
    if (archivo) 
    {
      const reader = new FileReader();      
      reader.onload = () => 
      {
        const base64String = reader.result as string;
        this.imagenPrevisualizacion = base64String;
        this.juego.imagen = base64String.split(',')[1]; 
      };
      reader.readAsDataURL(archivo);
    }
  }

  onSubmit(): void
  {
    this.videojuegos.publicarJuego(this.juego).subscribe
    (
      {
        next: (resp) => 
        {
          this.mensajeExito = '¡Juego publicado correctamente!';
          this.mensajeError = '';
          setTimeout(() => this.router.navigate(['/home']), 1000);
        },
        error: (err) => 
        {
          console.error(err);
          this.mensajeError = 'Error al publicar. Verifica los datos.';
        } 
      }
    );
  }
}