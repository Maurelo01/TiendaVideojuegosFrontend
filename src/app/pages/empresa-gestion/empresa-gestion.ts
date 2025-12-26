import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EmpresaService } from '../../../services/empresaServices/empresa';
import { VideojuegosService } from '../../../services/videojuegoServices/videojuegos';
import { Videojuego } from '../../../models/videojuego';

@Component({
    selector: 'app-empresa-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './empresa-gestion.html',
    styleUrls: ['./empresa-gestion.css']
})
export class EmpresaGestion implements OnInit 
{
    idEmpresa: number = 0;
    nombreUsuario: string = '';
    empleados: any[] = [];
    misJuegos: Videojuego[] = [];

    nuevoEmpleado =
    {
        nombreEmpleado: '',
        correo: '',
        contrasena: '',
        fechaNacimiento: ''
    };

    modoEdicionJuego: boolean = false;
    juegoEnEdicion: Videojuego =
    {
        idJuego: 0,
        idEmpresa: 0,
        titulo: '',
        descripcion: '',
        precio: 0,
        recursosMinimos: '',
        clasificacionEdad: 'E',
        estado: '',
        imagen: ''
    };

    seccionActiva: 'juegos' | 'empleados' = 'juegos';
    mensaje: string = '';
    error: string = '';

    constructor
    (
        private authService: AuthService,
        private empresaService: EmpresaService,
        private videojuegosService: VideojuegosService
    ) { }

    ngOnInit(): void 
    {
        const usuario = this.authService.obtenerUsuarioActual();
        if (usuario && usuario.rol === 'EMPRESA') 
        {
            this.idEmpresa = usuario.idEmpresa || 0;
            this.nombreUsuario = (usuario as any).nickname || usuario.correo;
            this.cargarDatos();
        }
    }

    cargarDatos() 
    {
        this.cargarJuegos();
        this.cargarEmpleados();
    }

    cargarJuegos() 
    {
        this.videojuegosService.obtenerPorEmpresa(this.idEmpresa).subscribe
        (
            {
                next: (data) => this.misJuegos = data,
                error: (err) => console.error(err)
            }
        );
    }

    cargarEmpleados() 
    {
        this.empresaService.listarEmpleados(this.idEmpresa).subscribe
        (
            {
                next: (data) => this.empleados = data,
                error: (err) => console.error(err)
            }
        );
    }

    iniciarEdicion(juego: Videojuego)
    {
        this.juegoEnEdicion = { ...juego }; 
        this.modoEdicionJuego = true;
        this.seccionActiva = 'juegos';
        setTimeout(() => 
        {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }

    cancelarEdicion()
    {
        this.modoEdicionJuego = false;
        this.juegoEnEdicion = { idJuego: 0, idEmpresa: 0, titulo: '', descripcion: '', precio: 0, recursosMinimos: '', clasificacionEdad: 'E', estado: '', imagen: '' };
    }

    guardarEdicionJuego() 
    {
        if (!this.juegoEnEdicion.titulo || !this.juegoEnEdicion.descripcion || this.juegoEnEdicion.precio < 0)
        {
            this.mostrarError('Por favor verifica los campos obligatorios.');
            return;
        }

        this.videojuegosService.editarJuego(this.juegoEnEdicion.idJuego, this.juegoEnEdicion).subscribe
        (
            {
                next: (resp) => 
                {
                    this.mostrarMensaje('Juego actualizado exitosamente.');
                    this.modoEdicionJuego = false;
                    this.cargarJuegos();
                },
                error: (err) => 
                {
                    this.mostrarError('Error al actualizar: ' + (err.error || err.message));
                }
            }
        );
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
                this.juegoEnEdicion.imagen = base64String.split(',')[1];
            };
            reader.readAsDataURL(archivo);
        }
    }

    cambiarEstadoJuego(juego: Videojuego) 
    {
        if (juego.estado === 'ACTIVO') 
        {
            if (!confirm(`¿Suspender venta de "${juego.titulo}"? Desaparecerá de la tienda.`)) return;
            this.videojuegosService.suspenderJuego(juego.idJuego).subscribe
            (
                {
                    next: () => 
                    {
                        this.mostrarMensaje('Juego suspendido correctamente.');
                        this.cargarJuegos();
                    },
                    error: (err) => this.mostrarError('Error al suspender.')
                }
            );
        }
        else
        {
            this.videojuegosService.activarJuego(juego.idJuego).subscribe
            (
                {
                    next: () => 
                    {
                        this.mostrarMensaje('Juego reactivado exitosamente.');
                        this.cargarJuegos();
                    },
                    error: (err) => this.mostrarError('Error al activar.')
                }
            );
        }
    }

    crearEmpleado() 
    {
        const empleadoNuevo = 
        {
            nombreEmpleado: this.nuevoEmpleado.nombreEmpleado,
            correo: this.nuevoEmpleado.correo,
            fechaNacimiento: this.nuevoEmpleado.fechaNacimiento,
            contraseña: this.nuevoEmpleado.contrasena
        };
        this.empresaService.agregarEmpleado(this.idEmpresa, empleadoNuevo).subscribe
        (
            {
                next: () => 
                {
                    this.mostrarMensaje('Empleado agregado.');
                    this.nuevoEmpleado = { nombreEmpleado: '', correo: '', contrasena: '', fechaNacimiento: '' };
                    this.cargarEmpleados();
                },
                error: (err) => this.mostrarError(err.error || 'Error al agregar empleado.')
            }
        );
    }

    eliminarEmpleado(idEmpleado: number) 
    {
        if (!confirm('¿Estás seguro de eliminar a este empleado? Perderá el acceso.')) return;
        this.empresaService.eliminarEmpleado(this.idEmpresa, idEmpleado).subscribe
        (
            {
                next: () => 
                {
                    this.mostrarMensaje('Empleado eliminado.');
                    this.cargarEmpleados();
                },
                error: (err) => 
                {
                    if (err.status === 409) 
                    {
                        this.mostrarError(err.error);
                    }
                    else
                    {
                        this.mostrarError('Error al eliminar empleado.');
                    }
                }
            }
        );
    }

    mostrarMensaje(msg: string)
    {
        this.mensaje = msg;
        setTimeout(() => this.mensaje = '', 5000);
    }

    mostrarError(msg: string)
    {
        this.error = msg;
        setTimeout(() => this.error = '', 10000);
    }
}