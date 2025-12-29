import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuarioServices/UsuarioService';
import { UsuarioGamer } from '../../../models/usuario-gamer';
import { ComprasService, HistorialCompra } from '../../../services/compras';

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
    imagenPrevisualizacion: string | null = null;
    gamerEdicion: any = {};
    mostrarModalRecarga: boolean = false;
    montoRecarga: number = 0;
    historialCompras: HistorialCompra[] = [];
    mensaje: string = '';
    error: string = '';

    constructor
    (
        private authService: AuthService,
        private usuarioService: UsuarioService,
        private comprasService: ComprasService,
        private router: Router
    ) { }

    ngOnInit(): void
    {
        const usuario = this.authService.obtenerUsuarioActual();
        if (usuario && usuario.rol === 'GAMER')
        {
            this.idUsuario = usuario.idUsuario || 0;
            this.cargarPerfil();
            this.cargarHistorial();
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
                    if (this.gamerEdicion.avatar) 
                    {
                        this.imagenPrevisualizacion = 'data:image/jpeg;base64,' + this.gamerEdit.avatar;
                    }
                },
                error: (err) => this.error = 'Error cargando perfil.'
            }
        );
    }

    cargarHistorial() 
    {
        this.comprasService.obtenerHistorialUsuario(this.idUsuario).subscribe
        (
            {
                next: (data) => this.historialCompras = data,
                error: (err) => console.error('Error cargando historial', err)
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
            if (this.gamer.avatar) 
            {
                this.imagenPrevisualizacion = 'data:image/jpeg;base64,' + this.gamerEdit.avatar;
            }
        }
    }

    cancelarEdicion()
    {
        this.modoEdicion = false;
        this.error = '';
        this.contrasena = '';
        if (this.gamer && this.gamer.avatar) 
        {
            this.imagenPrevisualizacion = 'data:image/jpeg;base64,' + this.gamer.avatar;
        }
        else
        {
            this.imagenPrevisualizacion = null;
        }
    }

    guardarCambios()
    {
        if (!this.gamerEdit.nickname || !this.gamerEdit.telefono)
        {
            this.error = "Nickname y teléfono son obligatorios";
            return;
        }
        if (this.contrasena && this.contrasena.trim() !== '')
        {
            this.gamerEdit.contraseña = this.contrasena;
        }
        else
        {
            delete this.gamerEdicion.contraseña; 
        }
        this.usuarioService.actualizarPerfilGamer(this.idUsuario, this.gamerEdit).subscribe
        (
            {
                next: (resp) => 
                {
                    this.mensaje = 'Perfil actualizado correctamente.';
                    if (this.gamerEdit.nickname !== this.gamer?.nickname)
                    {
                        this.authService.actualizarSesion({nickname: this.gamerEdit.nickname});
                    }
                    setTimeout(() => {window.location.reload();}, 500);
                    this.modoEdicion = false;
                },
                error: (err) => 
                {
                    this.error = err.error || 'No se pudo actualizar el perfil.';
                }
            }
        );
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
                this.imagenPrevisualizacion = base64;
                this.gamerEdit.avatar = base64.split(',')[1]; 
            };
            reader.readAsDataURL(file);
        }
    }

    abrirRecarga() 
    {
        this.montoRecarga = 0;
        this.mostrarModalRecarga = true;
        this.mensaje = '';
        this.error = '';
    }

    cerrarRecarga() 
    {
        this.mostrarModalRecarga = false;
    }

    confirmarRecarga() 
    {
        if (this.montoRecarga <= 0) 
        {
            alert("Por favor ingresa un monto válido mayor a 0.");
            return;
        }
        this.usuarioService.recargarSaldo(this.idUsuario, this.montoRecarga).subscribe(
            {
                next: (res: any) => 
                {
                    if (this.gamer) 
                    {
                        const saldoNuevo = res.nuevoSaldo !== undefined ? res.nuevoSaldo : (this.gamer.saldoCartera || 0) + this.montoRecarga;
                        this.gamer.saldoCartera = saldoNuevo;
                    }
                    this.mensaje = '¡Recarga exitosa! Tu nuevo saldo está disponible.';
                    this.cerrarRecarga();
                },
                error: (err) => 
                {
                    console.error(err);
                    alert('Error al recargar: ' + (err.error?.mensaje || err.message || 'Intente más tarde'));
                }
            }
        );
    }
}