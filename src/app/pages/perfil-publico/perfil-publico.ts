import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuarioServices/UsuarioService';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-perfil-publico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil-publico.html'
})
export class PerfilPublicoComponent implements OnInit 
{
  perfil: any = null;
  cargando = true;
  esPrivado = false;
  idUsuarioActual: number = 0;

  constructor
  (
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit()
  {
    this.route.paramMap.subscribe
    (
      params => 
      {
        const idBuscado = Number(params.get('id'));
        if (idBuscado)
        {
          this.cargarPerfil(idBuscado);
        }
      }
    );
  }

  cargarPerfil(idBuscado: number)
  {
    const usuarioActual = this.authService.obtenerUsuarioActual();
    this.idUsuarioActual = usuarioActual?.idUsuario || 0;
    if (this.idUsuarioActual === idBuscado)
    {
      this.router.navigate(['/perfil-gamer']);
      return;
    }

    this.cargando = true;
    this.usuarioService.obtenerPerfilPublico(idBuscado, this.idUsuarioActual).subscribe
    (
      {
        next: (data) => 
        {
          this.perfil = data;
          this.esPrivado = !data.perfilPublico;
          this.cargando = false;
        },
        error: (err) =>
        {
          console.error(err);
          alert('Usuario no encontrado o error de conexión.');
          this.router.navigate(['/home']);
        }
      }
    );
  }
}