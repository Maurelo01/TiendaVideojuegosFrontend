import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VideojuegosService } from '../../../services/videojuegoServices/videojuegos';
import { ComentariosService } from '../../../services/comentarios';
import { UsuarioService } from '../../../services/usuarioServices/UsuarioService';
import { AuthService } from '../../../services/auth.service';
import { Videojuego, Multimedia } from '../../../models/videojuego';
import { Comentario } from '../../../models/comentario';

@Component({
    selector: 'app-juego-detalle',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './juego-detalle.html',
    styleUrls: ['./juego-detalle.css']
})
export class JuegoDetalleComponent implements OnInit
{
    juego: Videojuego | null = null;
    multimedia: Multimedia[] = [];
    comentarios: Comentario[] = [];
    idComentarioAresponder: number | null = null;
    nombreUsuarioAresponder: string = '';

    idJuego: number = 0;
    usuarioActual: any = null;
    tieneElJuego: boolean = false;
    esModerador: boolean = false;

    nuevoComentario: Comentario = { idGamer: 0, idJuego: 0, texto: '', calificacion: 5 };
    editandoComentarioId: number | null = null;
    cargando: boolean = true;

    constructor
    (
        private route: ActivatedRoute,
        private videojuegosService: VideojuegosService,
        private comentariosService: ComentariosService,
        private authService: AuthService,
        private usuarioService: UsuarioService
    ) { }

    ngOnInit(): void 
    {
        this.route.params.subscribe
        (
            params => 
            {
                this.idJuego = +params['id'];
                this.usuarioActual = this.authService.obtenerUsuarioActual();
                this.cargarDatos();
            }
        );
    }

    cargarDatos()
    {
        this.cargando = true;
        this.videojuegosService.obtenerJuegoPorId(this.idJuego).subscribe
        (
            data => 
            {
                this.juego = data;
                this.videojuegosService.obtenerMultimedia(this.idJuego).subscribe(media => this.multimedia = media);
                if (this.usuarioActual && this.usuarioActual.rol === 'GAMER')
                {
                    this.verificarPropiedad();
                }
                this.cargarComentarios();
                this.verificarPermisosModeracion();
                this.cargando = false;
            }
        );
    }

    verificarPropiedad()
    {
        this.usuarioService.obtenerBiblioteca(this.usuarioActual.idUsuario).subscribe
        (
                lista => 
            {
                this.tieneElJuego = lista.some(item => item.idJuego === this.idJuego);
            }
        );
    }

    verificarPermisosModeracion() 
    {
        if (this.usuarioActual && this.juego) 
        {
            if (this.usuarioActual.rol === 'ADMIN') 
            {
                this.esModerador = true;
            } 
            else if (this.usuarioActual.rol === 'EMPRESA' && this.usuarioActual.idEmpresa === this.juego.idEmpresa) 
            {
                this.esModerador = true;
            }
        }
    }

    herramientaModeracion(comentario: Comentario) 
    {
        if (!this.usuarioActual || !comentario.idComentario) return;
        const nuevoEstado = !comentario.oculto;
        const accion = nuevoEstado ? 'ocultar' : 'mostrar';
        if (!confirm(`¿Deseas ${accion} el contenido de este comentario? Las estrellas seguirán visibles.`)) return;
        this.comentariosService.moderarComentario(comentario.idComentario, this.usuarioActual.idUsuario, nuevoEstado).subscribe
        (
            {
                next: () =>
                {
                    comentario.oculto = nuevoEstado;
                },
                error: (err) => alert('Error al moderar: ' + (err.error?.error || err.message))
            }
        );
    }

    cargarComentarios()
    {
        this.cargando = true;
        this.videojuegosService.obtenerJuegoPorId(this.idJuego).subscribe
        (
            data => 
            {
                this.juego = data;
                this.videojuegosService.obtenerMultimedia(this.idJuego).subscribe
                (
                    (media) => 
                    {
                        this.multimedia = media;
                    }
                );
                this.cargando = false;
            }
        );
        this.comentariosService.listarComentarios(this.idJuego).subscribe
        (
            data => 
            {
                this.comentarios = this.procesarComentariosRecursivo(data);
                this.cargando = false;
            }
        );
    }

    procesarComentariosRecursivo(lista: Comentario[]): Comentario[]
    {
        return lista.map
        (
            c => 
            {
                const esPropio = this.usuarioActual && c.idGamer === this.usuarioActual.idUsuario;
                if (c.respuestas && c.respuestas.length > 0)
                {
                    c.respuestas = this.procesarComentariosRecursivo(c.respuestas);
                }
                return { 
                    ...c,
                    esMio: esPropio
                };
            }
        );
    }

    enviarComentario()
    {
        if (!this.nuevoComentario.texto.trim()) return;
        
        const comentario: any = 
        {
            idComentario: this.editandoComentarioId || undefined,
            idGamer: this.usuarioActual.idUsuario,
            idJuego: this.idJuego,
            texto: this.nuevoComentario.texto,
            calificacion: this.nuevoComentario.calificacion,
            idComentarioPrincipal: this.editandoComentarioId ? this.nuevoComentario.idComentarioPrincipal : (this.idComentarioAresponder || undefined)
        };
        if (comentario.idComentarioPrincipal) 
        {
             comentario.calificacion = 0; 
        }
        if (this.editandoComentarioId)
        {
             this.comentariosService.editarComentario(this.editandoComentarioId, comentario).subscribe
             (
                {
                    next: () => 
                    {
                        this.cancelarEdicion();
                        this.cargarComentarios();
                    },
                    error: (err) => alert('Error al editar: ' + (err.error?.error || err.message))
                }
             );
        }
        else
        {
            this.comentariosService.publicarComentario(comentario).subscribe
            (
                {
                    next: () => 
                    {
                        this.nuevoComentario = { idGamer: 0, idJuego: 0, texto: '', calificacion: 5 };
                        this.cancelarRespuesta();
                        this.cargarComentarios();
                    },
                    error: (err) => alert('Error al publicar: ' + (err.error?.error || err.message))
                }
            );
        }
    }

    iniciarEdicion(comentario: Comentario)
    {
        this.editandoComentarioId = comentario.idComentario!;
        this.nuevoComentario = { ...comentario };
        document.getElementById('form-comentario')?.scrollIntoView({ behavior: 'smooth' });
        if (comentario.idComentarioPrincipal) 
        {
            this.idComentarioAresponder = null;
        }
        setTimeout(() => { document.getElementById('form-comentario')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
    }

    cancelarEdicion()
    {
        this.editandoComentarioId = null;
        this.nuevoComentario = { idGamer: 0, idJuego: 0, texto: '', calificacion: 5 };
    }

    borrarComentario(id: number)
    {
        if (!confirm('¿Borrar tu reseña?')) return;
        this.comentariosService.eliminarComentario(id, this.usuarioActual.idUsuario).subscribe
        (
            () => 
            {
                this.cargarComentarios();
            }
        );
    }

    generarEstrellas(calificacion: number): any[] 
    {
        return Array(Math.floor(calificacion)).fill(0);
    }

    generarEstrellasVacias(calificacion: number): any[]
    {
        return Array(5 - Math.floor(calificacion)).fill(0);
    }

    responderComentario(comentarioPadre: Comentario)
    {
        this.idComentarioAresponder = comentarioPadre.idComentario || null;
        this.nombreUsuarioAresponder = comentarioPadre.nicknameGamer || 'Usuario';
        this.nuevoComentario = { idGamer: 0, idJuego: 0, texto: '', calificacion: 0 };        
        setTimeout(() => {document.getElementById('form-comentario')?.scrollIntoView({ behavior: 'smooth' });}, 100);
    }

    cancelarRespuesta()
    {
        this.idComentarioAresponder = null;
        this.nombreUsuarioAresponder = '';
        this.nuevoComentario = { idGamer: 0, idJuego: 0, texto: '', calificacion: 5 };
    }   
}