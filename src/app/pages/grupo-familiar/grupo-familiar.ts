import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GruposService, GrupoFamiliar, SolicitudGrupo } from '../../../services/grupos';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-grupo-familiar',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './grupo-familiar.html'
})
export class GrupoFamiliarComponent implements OnInit
{
    grupo: GrupoFamiliar | null = null;
    usuarioActual: any = null;
    cargando: boolean = true;
    esLider: boolean = false;
    nuevoNombreGrupo: string = '';
    nickInvitado: string = '';
    mensaje: string = '';
    error: string = '';

    constructor
    (
        private gruposService: GruposService,
        private authService: AuthService
    ) {}

    ngOnInit(): void 
    {
        this.usuarioActual = this.authService.obtenerUsuarioActual();
        if (this.usuarioActual && this.usuarioActual.rol === 'GAMER') 
        {
            this.cargarDatosGrupo();
        }
    }

    cargarDatosGrupo()
    {
        this.cargando = true;
        this.gruposService.obtenerMiGrupo(this.usuarioActual.idUsuario).subscribe
        (
            {
                next: (data) => 
                {
                    this.grupo = data;
                    if (this.grupo)
                    {
                        this.esLider = (this.grupo.idLider === this.usuarioActual.idUsuario);
                    }
                    this.cargando = false;
                },
                error: (err) => 
                {
                    this.grupo = null;
                    this.cargando = false;
                }
            }
        );
    }

    crearGrupo() 
    {
        if (!this.nuevoNombreGrupo.trim()) return;
        const solicitud: SolicitudGrupo = 
        {
            idLider: this.usuarioActual.idUsuario,
            nombreGrupo: this.nuevoNombreGrupo
        };
        this.gruposService.crearGrupo(solicitud).subscribe
        (
            {
                next: () => 
                {
                    this.mensaje = '¡Grupo creado con éxito!';
                    this.cargarDatosGrupo();
                },
                error: (err) => this.mostrarError(err.error?.mensaje || 'Error al crear grupo.')
            }
        );
    }

    invitarMiembro()
    {
        if (!this.nickInvitado.trim() || !this.grupo) return;
        const solicitud: SolicitudGrupo = 
        {
            idLider: this.usuarioActual.idUsuario,
            idGrupo: this.grupo.idGrupo,
            nicknameMiembro: this.nickInvitado
        };
        this.gruposService.agregarMiembro(solicitud).subscribe
        (
            {
                next: () => 
                {
                    this.mensaje = `Usuario '${this.nickInvitado}' agregado correctamente.`;
                    this.nickInvitado = '';
                    this.cargarDatosGrupo();
                },
                error: (err) => this.mostrarError(err.error?.mensaje || 'No se pudo agregar al usuario.')
            }
        );
    }

    expulsar(idMiembro: number)
    {
        if (!confirm('¿Estás seguro de expulsar a este miembro?')) return;
        if (!this.grupo) return;
        const solicitud: SolicitudGrupo = 
        {
            idLider: this.usuarioActual.idUsuario,
            idGrupo: this.grupo.idGrupo,
            idUsuarioMiembro: idMiembro
        };
        this.gruposService.expulsarMiembro(solicitud).subscribe
        (
            {
                next: () => 
                {
                    this.mensaje = 'Miembro expulsado.';
                    this.cargarDatosGrupo();
                },
                error: (err) => this.mostrarError(err.error?.mensaje || 'Error al expulsar miembro.')
            }
        );
    }

    disolverGrupo() 
    {
        if (!confirm('¿Estas seguro de disolver el grupo permanentemente? Todos los miembros perderán el acceso y es irreversible.')) return;
        if (!this.grupo) return;
        this.gruposService.eliminarGrupo(this.grupo.idGrupo, this.usuarioActual.idUsuario).subscribe
        (
            {
                next: () => 
                {
                    alert('El grupo ha sido disuelto.');
                    this.grupo = null;
                    this.esLider = false;
                    this.cargarDatosGrupo();
                },
                error: (err) => this.mostrarError(err.error?.mensaje || 'Error al disolver el grupo.')
            }
        );
    }

    mostrarError(mensaje: string)
    {
        this.error = mensaje;
        setTimeout(() => this.error = '', 10000);
    }
}