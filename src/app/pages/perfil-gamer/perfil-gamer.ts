import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuarioServices/UsuarioService';
import { UsuarioGamer } from '../../../models/usuario-gamer';

@Component({
    selector: 'app-perfil-gamer',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './perfil-gamer.html',
    styleUrls: ['./perfil-gamer.css']
})
export class PerfilGamerComponent implements OnInit 
{
    gamer: UsuarioGamer | null = null;
    gamerEdit: UsuarioGamer = {} as UsuarioGamer;
    idUsuario: number = 0;
    modoEdicion: boolean = false;
    contrasena: string = '';
    mensaje: string = '';
    error: string = '';

    constructor
    (
        private authService: AuthService,
        private usuarioService: UsuarioService,
        private router: Router
    ) { }

    ngOnInit(): void
    {
        const usuario = this.authService.obtenerUsuarioActual();
        if (usuario && usuario.rol === 'GAMER')
        {
            this.idUsuario = usuario.idUsuario || 0;
            this.cargarPerfil();
        }
        else
        {
            this.router.navigate(['/home']);
        }
    }

    cargarPerfil()
    {
        this.usuarioService.obtenerPerfilGamer(this.idUsuario).subscribe
        (
            {
                next: (data) => 
                {
                    this.gamer = data;
                    this.gamerEdit = {...data};
                    this.contrasena = '';
                },
                error: (err) => this.error = 'Error cargando perfil.'
            }
        );
    }

    activarEdicion()
    {
        this.modoEdicion = true;
        this.mensaje = '';
        this.error = '';
        if (this.gamer)
        {
            this.gamerEdit = {...this.gamer,};
            this.contrasena = '';
        }
    }

    cancelarEdicion()
    {
        this.modoEdicion = false;
        this.error = '';
        this.contrasena = '';
    }

    guardarCambios()
    {
        if (this.contrasena && this.contrasena.trim() !== '')
        {
            this.gamerEdit.contraseña = this.contrasena;
        }
        else
        {
            this.gamerEdit.contraseña = ''; 
        }
        this.usuarioService.actualizarPerfilGamer(this.idUsuario, this.gamerEdit).subscribe
        (
            {
                next: (resp) => 
                {
                    this.mensaje = 'Perfil actualizado correctamente.';
                    this.authService.actualizarSesion({nickname: this.gamerEdit.nickname});
                    setTimeout(() => {window.location.reload();}, 1000);
                    this.modoEdicion = false;
                },
                error: (err) => 
                {
                    this.error = err.error || 'No se pudo actualizar el perfil.';
                }
            }
        );
    }
}