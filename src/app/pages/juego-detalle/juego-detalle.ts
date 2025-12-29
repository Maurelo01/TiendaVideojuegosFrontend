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

    idJuego: number = 0;
    usuarioActual: any = null;
    tieneElJuego: boolean = false;

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
                    this.comentarios = data.map
                    (
                        c => 
                        (
                            {
                                ...c,
                                esMio: this.usuarioActual && c.idGamer === this.usuarioActual.idUsuario
                            }
                        )
                    );
                }
        );
    }

    enviarComentario()
    {
        if (!this.nuevoComentario.texto.trim()) return;
        const comentario: Comentario = 
        {
            ...this.nuevoComentario,
            idGamer: this.usuarioActual.idUsuario,
            idJuego: this.idJuego
        };

        if (this.editandoComentarioId)
        {
            this.comentariosService.editarComentario(this.editandoComentarioId, comentario).subscribe
            (
                () =>
                {
                    this.cancelarEdicion();
                    this.cargarComentarios();
                }
            );
        }
        else
        {
            this.comentariosService.publicarComentario(comentario).subscribe
            (
                () => 
                {
                    this.nuevoComentario = { idGamer: 0, idJuego: 0, texto: '', calificacion: 5 };
                    this.cargarComentarios();
                }
            );
        }
    }

    iniciarEdicion(comentario: Comentario)
    {
        this.editandoComentarioId = comentario.idComentario!;
        this.nuevoComentario = { ...comentario };
        document.getElementById('form-comentario')?.scrollIntoView({ behavior: 'smooth' });
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
}