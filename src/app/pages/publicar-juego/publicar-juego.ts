import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { VideojuegosService } from '../../../services/videojuegoServices/videojuegos';
import { AuthService } from '../../../services/auth.service';
import { Videojuego } from '../../../models/videojuego';
import { Categoria } from '../../../models/categoria';

@Component({
  selector: 'app-publicar-juego',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
    imagen: '',
    idsCategorias: []
  };

  idEmpresa: number = 0;
  todasLasCategorias: Categoria[] = [];
  mensajeError: string = '';
  mensajeExito: string = '';
  imagenPrevisualizacion: string | null = null; // Para mostrar la imagen seleccionada

  constructor
  (
    private videojuegosService: VideojuegosService, 
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void 
  {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario && usuario.rol === 'EMPRESA') 
    {
      this.idEmpresa = usuario.idEmpresa || 0;
      this.juego.idEmpresa = this.idEmpresa;
      this.cargarCategorias(); 
    }
    else
    {
      this.router.navigate(['/home']);
    }
  }

  cargarCategorias() 
  {
    this.videojuegosService.obtenerCategorias().subscribe
    (
      {
        next: (data) => this.todasLasCategorias = data,
        error: (err) => console.error('Error cargando categorías', err)
      }
    );
  }

  onCategoriaChange(idCat: number, event: any)
  {
    const checked = event.target.checked;
    if (!this.juego.idsCategorias) this.juego.idsCategorias = [];
    if (checked) 
    {
      this.juego.idsCategorias.push(idCat);
    }
    else
    {
      this.juego.idsCategorias = this.juego.idsCategorias.filter(id => id !== idCat);
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
    this.videojuegosService.publicarJuego(this.juego).subscribe
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