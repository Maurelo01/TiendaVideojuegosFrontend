import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/adminSevices/admin';

@Component({
    selector: 'app-admin-empresas',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-empresas.html',
    styleUrls: ['./admin-empresas.css']
})
export class AdminEmpresas implements OnInit 
{
    empresas: any[] = [];
    vistaActual: 'lista' | 'formulario' = 'lista';
    esEdicion: boolean = false;

    formEmpresa = 
    {
        empresa: 
        {
            idEmpresa: 0,
            nombreEmpresa: '',
            descripcion: '',
            porcentajeComisionEspecifica: 0,
            imagenBanner: ''
        },
        usuario: 
        {
            nombreEmpleado: '',
            correo: '',
            contrasena: '',
            fechaNacimiento: ''
        }
    };

    imagenPrevisualizacion: string | null = null;
    mensaje: string = '';
    error: string = '';

    constructor(private adminService: AdminService) { }

    ngOnInit(): void 
    {
        this.cargarEmpresas();
    }

    cargarEmpresas() 
    {
        this.adminService.listarEmpresas().subscribe
        (
            {
                next: (data) => this.empresas = data,
                error: (err) => console.error(err)
            }
        );
    }

    iniciarCreacion() 
    {
        this.vistaActual = 'formulario';
        this.esEdicion = false;
        this.limpiarFormulario();
    }

    iniciarEdicion(empresa: any) 
    {
        this.vistaActual = 'formulario';
        this.esEdicion = true;
        this.formEmpresa.empresa = { ...empresa, imagenBanner: '' };
        this.imagenPrevisualizacion = empresa.imagenBanner ? 'data:image/jpeg;base64,' + empresa.imagenBanner : null;
    }

    cancelar() 
    {
        this.vistaActual = 'lista';
        this.error = '';
        this.mensaje = '';
    }

    limpiarFormulario() 
    {
        this.formEmpresa = 
        {
            empresa: { idEmpresa: 0, nombreEmpresa: '', descripcion: '', porcentajeComisionEspecifica: 0, imagenBanner: '' },
            usuario: { nombreEmpleado: '', correo: '', contrasena: '', fechaNacimiento: '' }
        };
        this.imagenPrevisualizacion = null;
    }

    onFileSelected(event: any) 
    {
        const archivo = event.target.files[0];
        if (archivo) 
        {
            const reader = new FileReader();
            reader.onload = () => 
            {
                this.imagenPrevisualizacion = reader.result as string;
                this.formEmpresa.empresa.imagenBanner = this.imagenPrevisualizacion.split(',')[1];
            };
            reader.readAsDataURL(archivo);
        }
    }

    guardar()
    {
        this.error = '';
        if (this.esEdicion) 
        {
            this.adminService.editarEmpresa(this.formEmpresa.empresa.idEmpresa, this.formEmpresa.empresa).subscribe({
                next: () => 
                {
                    this.mensaje = 'Empresa actualizada correctamente.';
                    this.cargarEmpresas();
                    this.vistaActual = 'lista';
                },
                error: (err) => this.error = err.error || 'Error al actualizar.'
            });

        }
        else
        {
            const usuarioLimpio = 
            {
                nombreEmpleado: this.formEmpresa.usuario.nombreEmpleado,
                correo: this.formEmpresa.usuario.correo,
                fechaNacimiento: this.formEmpresa.usuario.fechaNacimiento,
                contraseña: this.formEmpresa.usuario.contrasena // Asignamos el valor a la variable con ñ
            };
            
            const solicitud = 
            {
                empresa: this.formEmpresa.empresa,
                usuario: usuarioLimpio
            };

            this.adminService.registrarEmpresa(solicitud).subscribe
            (
                {
                    next: () => 
                    {
                        this.mensaje = 'Empresa y usuario creados exitosamente.';
                        this.cargarEmpresas();
                        this.vistaActual = 'lista';
                    },
                    error: (err) => this.error = err.error || 'Error al crear empresa.'
                }
            );
        }
    }

    cambiarEstado(emp: any) 
    {
        if (emp.estado === 'ACTIVO')
        {
            if (!confirm(`¿Suspender a ${emp.nombreEmpresa}? Sus juegos dejarán de venderse.`)) return;
            this.adminService.suspenderEmpresa(emp.idEmpresa).subscribe
            (
                {
                    next: () => { this.cargarEmpresas(); },
                    error: (err) => alert('Error al suspender')
                }
            );
        }
        else
        {
            this.adminService.activarEmpresa(emp.idEmpresa).subscribe
            (
                {
                    next: () => { this.cargarEmpresas(); },
                    error: (err) => alert('Error al activar')
                }
            );
        }
    }
}