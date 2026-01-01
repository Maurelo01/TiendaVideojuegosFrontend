import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/adminSevices/admin';
import { VideojuegosService } from '../../../services/videojuegoServices/videojuegos';
import { ComprasService, SolicitudCompra } from '../../../services/compras';
import { Videojuego } from '../../../models/videojuego';
import { Categoria } from '../../../models/categoria';
import { UsuarioService } from '../../../services/usuarioServices/UsuarioService';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements OnInit 
{
  juegoSeleccionadoCompra: Videojuego | null = null;
  fechaSimulada: string = new Date().toISOString().split('T')[0];
  mostrarModalCompra: boolean = false;
  mensajeCompra: string = '';
  errorCompra: string = '';
  procesandoCompra: boolean = false;
  juegos: Videojuego[] = [];
  cargando: boolean = true;
  usuarioNombre: string | null = null;
  usuarioId: number | null = null;
  esEmpresa: boolean = false;
  esAdmin: boolean = false;
  banners: any[] = [];
  juegosDestacados: Videojuego[] = [];
  categorias: Categoria[] = [];
  textoBusqueda: string = '';
  categoriaSeleccionada: number = 0;
  buscando: boolean = false;
  comprando: { [key: number]: boolean } = {};
  busquedaUsuario: string = '';
  usuariosEncontrados: any[] = [];

  constructor
  (
    private adminService: AdminService,
    private videojuegosService: VideojuegosService,
    private comprasService: ComprasService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void 
  {
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario) 
    {
      this.usuarioId = usuario.idUsuario || null;
      this.usuarioNombre = (usuario as any).nickname || usuario.correo;
      
      if (usuario.rol === 'EMPRESA') 
      {
        this.usuarioNombre = `${usuario.nombreEmpleado} - ${usuario.nombreEmpresaAux}`;
        this.esEmpresa = true;
      }
      else if (usuario.rol === 'ADMIN')
      {
        this.usuarioNombre = 'Administrador';
        this.esAdmin = true;
      }
      else 
      {
        this.usuarioNombre = usuario.nickname || usuario.correo;
      }
    }
    
    this.cargarCatalogo();
    this.cargarBanners();
    this.cargarJuegos();
    this.cargarCategorias();
  }

  cargarCatalogo(): void 
  {
    this.videojuegosService.obtenerJuegos().subscribe
    (
      {
        next: (data) => 
        {
          this.juegos = data;
          this.verificarPropiedadJuegos();
          this.cargando = false;
        },
        error: (err) => 
        {
          console.error('Error cargando juegos', err);
          this.cargando = false;
        }
      }
    );
  }

  verificarPropiedadJuegos(): void 
  {
    if (!this.usuarioId || this.esEmpresa || this.esAdmin) return;
    
    const verificaciones = this.juegos.map(juego => 
      this.comprasService.verificarPropiedad(this.usuarioId!, juego.idJuego)
    );
    
    forkJoin(verificaciones).subscribe
    (
      {
        next: (resultados) => 
        {
          this.juegos.forEach((juego, index) => 
          {
            juego.yaLoTiene = resultados[index].yaLoTiene;
          });
        },
        error: (err) => console.error('Error verificando propiedad:', err)
      }
    );
  }

  cargarBanners()
  {
    this.adminService.listarBanners().subscribe
    (
      {
        next: (data) => 
        {
          this.banners = data;
        },
        error: (err) => console.error('Error al cargar banners', err)
      }
    );
  }

  cargarCategorias()
  {
    this.videojuegosService.obtenerCategorias().subscribe
    (
      {
        next: (data) => 
        {
          this.categorias = data;
        },
        error: (err) => console.error('Error cargando categorías', err)
      }
    );
  }

  buscar()
  {
    if (!this.textoBusqueda.trim() && this.categoriaSeleccionada === 0)
    {
      this.cargarCatalogo();
      return;
    }
    
    this.buscando = true;
    this.videojuegosService.buscarJuegos
    (
      this.textoBusqueda,
      this.categoriaSeleccionada > 0 ? this.categoriaSeleccionada : undefined
    ).subscribe
    (
      {
        next: (data) => 
        {
          this.juegos = data;
          this.verificarPropiedadJuegos(); // AGREGADO: Verificar después de buscar
          this.buscando = false;
        },
        error: (err) => 
        {
          console.error('Error en búsqueda', err);
          this.buscando = false;
        }
      }
    );
  }

  limpiarFiltros()
  {
    this.textoBusqueda = '';
    this.categoriaSeleccionada = 0;
    this.cargarCatalogo();
  }

  cargarJuegos() 
  {
    this.videojuegosService.obtenerJuegos().subscribe
    (
      {
        next: (data) => 
        {
          this.juegosDestacados = data.slice(0, 6);
        },
        error: (err) => console.error(err)
      }
    );
  }

  cerrarSesion(): void 
  {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  abrirModalCompra(juego: Videojuego)
  {
    const usuario = this.authService.obtenerUsuarioActual();
    
    if (!usuario) 
    {
      this.router.navigate(['/login']);
      return;
    }
    
    if (usuario.rol !== 'GAMER') 
    {
      alert('Solo los usuarios Gamers pueden comprar juegos.');
      return;
    }

    // Verificar si ya tiene el juego
    if (juego.yaLoTiene) 
    {
      alert('Ya tienes este juego en tu biblioteca.');
      return;
    }

    this.juegoSeleccionadoCompra = juego;
    this.fechaSimulada = new Date().toISOString().split('T')[0];
    this.mensajeCompra = '';
    this.errorCompra = '';
    this.mostrarModalCompra = true;
  }

  cerrarModalCompra()
  {
    this.mostrarModalCompra = false;
    this.juegoSeleccionadoCompra = null;
    this.mensajeCompra = '';
    this.errorCompra = '';
  }

  confirmarCompra()
  {
    if (!this.juegoSeleccionadoCompra || !this.usuarioId) return;

    this.procesandoCompra = true;
    this.errorCompra = '';
    this.mensajeCompra = '';

    const solicitud: SolicitudCompra = 
    {
      idUsuario: this.usuarioId,
      idJuego: this.juegoSeleccionadoCompra.idJuego,
      fechaSimulada: this.fechaSimulada
    };

    this.comprasService.realizarCompra(solicitud).subscribe
    (
      {
        next: (respuesta) => 
        {
          this.mensajeCompra = respuesta.mensaje;
          this.procesandoCompra = false;
          
          if (this.juegoSeleccionadoCompra) 
          {
            const juego = this.juegos.find(j => j.idJuego === this.juegoSeleccionadoCompra!.idJuego);
            if (juego) 
            {
              juego.yaLoTiene = true;
            }
          }
          setTimeout(() => 
          {
            this.cerrarModalCompra();
          }, 2000);
        },
        error: (err) => 
        {
          console.error('Error en compra:', err);
          this.errorCompra = err.error?.error || 'Error al procesar la compra.';
          this.procesandoCompra = false;
        }
      }
    );
  }

  buscarUsuarios()
  {
    if (this.busquedaUsuario.trim().length < 3)
    {
      this.usuariosEncontrados = [];
      return;
    }
    this.usuarioService.buscarUsuarios(this.busquedaUsuario).subscribe
    (
      {
        next: (data) => this.usuariosEncontrados = data,
        error: () => this.usuariosEncontrados = []
      }
    );
  }

  irAPerfil(resultado: any)
  {
    this.busquedaUsuario = '';
    this.usuariosEncontrados = [];
    this.textoBusqueda = '';

    if (resultado.tipo === 'EMPRESA')
    {
      this.router.navigate(['/ver-empresa', resultado.id]);
    } 
    else
    {
      if (this.usuarioId && this.usuarioId === resultado.id)
      {
        this.router.navigate(['/mi-perfil']);
      } 
      else
      {
        this.router.navigate(['/usuario', resultado.id]);
      }
    }
  }
} 