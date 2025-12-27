import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/adminSevices/admin';
import { VideojuegosService } from '../../../services/videojuegoServices/videojuegos';
import { Videojuego } from '../../../models/videojuego';

@Component({
    selector: 'app-admin-banner',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-banner.html'
})
export class AdminBanner implements OnInit 
{
    banners: any[] = [];
    listaJuegos: Videojuego[] = [];
    
    nuevoBanner = 
    {
        idBanner: 0,
        idJuego: 0,
        titulo: '',
        imagenUrl: '',
        lugar: 1
    };

    modoEdicion: boolean = false;
    mensaje: string = '';
    error: string = '';

    constructor(
        private adminService: AdminService,
        private videojuegosService: VideojuegosService
    ) { }

    ngOnInit(): void 
    {
        this.cargarDatos();
    }

    cargarDatos() 
    {
        this.cargarBanners();
        this.videojuegosService.obtenerJuegos().subscribe
        (
            {
                next: (data) => this.listaJuegos = data,
                error: (err) => console.error('Error cargando juegos', err)
            }
        );
    }

    cargarBanners() 
    {
        this.adminService.listarBanners().subscribe
        (
            {
                next: (data) => this.banners = data,
                error: (err) => console.error(err)
            }
        );
    }

    iniciarEdicion(banner: any) 
    {
        this.modoEdicion = true;
        this.nuevoBanner = 
        { 
            idBanner: banner.idBanner,
            idJuego: banner.idJuego,
            titulo: banner.titulo,
            imagenUrl: '',
            lugar: banner.lugar
        };
        this.mensaje = '';
        this.error = '';
        window.scrollTo(0,0);
    }

    cancelarEdicion() 
    {
        this.modoEdicion = false;
        this.nuevoBanner = { idBanner: 0, idJuego: 0, titulo: '', imagenUrl: '', lugar: 1 };
    }

    onFileSelected(event: any)
    {
        const file = event.target.files[0];
        if (file)
        {
            const reader = new FileReader();
            reader.onload = () => 
            {
                const base64 = reader.result as string;
                this.nuevoBanner.imagenUrl = base64.split(',')[1];
            };
            reader.readAsDataURL(file);
        }
    }

    guardarBanner()
    {
        if (this.nuevoBanner.idJuego === 0) 
        {
            this.error = 'Debes seleccionar un juego.';
            return;
        }
        if (!this.modoEdicion && !this.nuevoBanner.imagenUrl)
        {
            this.error = 'Debes seleccionar una imagen para crear.';
            return;
        }
        if (!this.nuevoBanner.titulo)
        {
            const juego = this.listaJuegos.find(j => j.idJuego == this.nuevoBanner.idJuego);
            if (juego) this.nuevoBanner.titulo = juego.titulo;
        }
        if (this.modoEdicion)
        {
            this.adminService.editarBanner(this.nuevoBanner).subscribe
            (
                {
                    next: () => 
                    {
                        this.mensaje = 'Banner actualizado correctamente.';
                        this.finalizarAccion();
                    },
                    error: (err) => this.error = err.error || 'Error al actualizar (posible lugar ocupado).'
                }
            );
        }
        else
        {
            this.adminService.agregarBanner(this.nuevoBanner).subscribe
            (
                {
                    next: () => 
                    {
                        this.mensaje = 'Banner agregado correctamente.';
                        this.finalizarAccion();
                    },
                    error: (err) => this.error = err.error || 'Error: ' + err.message
                }
            );
        }
    }

    finalizarAccion() 
    {
        this.error = '';
        this.cancelarEdicion();
        this.cargarBanners();
    }

    eliminarBanner(id: number)
    {
        if (!confirm('¿Estás seguro de eliminar este banner del carrusel?')) return;
        this.adminService.eliminarBanner(id).subscribe
        (
            {
                next: () => 
                {
                    this.mensaje = 'Banner eliminado correctamente.';
                    this.cargarBanners();
                    if (this.modoEdicion && this.nuevoBanner.idBanner === id)
                    {
                        this.cancelarEdicion();
                    }
                },
                error: (err) => 
                {
                    console.error(err);
                    this.error = 'Error al eliminar el banner.';
                }
            }
        );
    }
}