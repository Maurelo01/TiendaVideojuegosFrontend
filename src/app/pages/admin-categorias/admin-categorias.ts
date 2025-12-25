import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/adminSevices/admin';
import { Categoria } from '../../../models/categoria';

@Component({
    selector: 'app-admin-categorias',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-categorias.html',
    styleUrls: ['./admin-categorias.css']
})
export class AdminCategorias implements OnInit 
{
    categorias: Categoria[] = [];
    categoriaSeleccionada: Categoria = { idCategoria: 0, nombreCategoria: '' };
    modoEdicion: boolean = false;
    mensaje: string = '';
    error: string = '';

    constructor(private adminService: AdminService) { }
    ngOnInit(): void 
    {
        this.cargarCategorias();
    }

    cargarCategorias() 
    {
        this.adminService.listarCategorias().subscribe
        (
            {
                next: (data) => this.categorias = data,
                error: (err) => console.error('Error cargando categorías', err)
            }
        );
    }

    guardarCategoria() 
    {
        if (!this.categoriaSeleccionada.nombreCategoria.trim()) return;
        if (this.modoEdicion)
        {
            this.realizarEdicion(false);
        }
        else
        {
            this.adminService.crearCategoria(this.categoriaSeleccionada).subscribe
            (
                {
                    next: (resp) => 
                    {
                        this.mensaje = 'Categoría creada exitosamente.';
                        this.limpiarFormulario();
                        this.cargarCategorias();
                    },
                    error: (err) => this.error = 'Error al crear: ' + err.error
                }
            );
        }
    }

    realizarEdicion(forzar: boolean) 
    {
        this.adminService.editarCategoria(this.categoriaSeleccionada, forzar).subscribe
        (
            {
                next: () => 
                {
                this.mensaje = 'Categoría actualizada correctamente.';
                this.limpiarFormulario();
                this.cargarCategorias();
                },
                error: (err) => 
                {
                    if (err.status === 409) 
                    {
                        const mensaje = typeof err.error === 'string' ? err.error : 'Esta categoría afecta a varios juegos.';
                        if (confirm(mensaje + '\n\n¿Confirmar cambios?')) 
                        {
                            this.realizarEdicion(true);
                        }
                    }
                    else
                    {
                        this.error = 'Error al actualizar: ' + (err.error || err.message);
                    }
                }
            }
        );
    }

    seleccionarParaEditar(cat: Categoria) 
    {
        this.categoriaSeleccionada = { ...cat };
        this.modoEdicion = true;
        this.mensaje = '';
        this.error = '';
    }

    eliminarCategoria(id: number) 
    {
        if (!confirm('¿Estás seguro de intentar eliminar esta categoría?')) return;
        this.adminService.eliminarCategoria(id, false).subscribe
        (
            {
                next: () => 
                {
                    this.mensaje = 'Categoría eliminada.';
                    this.cargarCategorias();
                },
                error: (err) => 
                {
                    if (err.status === 409) 
                    {
                        const mensaje = typeof err.error === 'string' ? err.error : 'Esta categoría está en uso.';
                        if (confirm(mensaje + '\n\n¿Deseas eliminarla de todos modos y desvincular los juegos?')) 
                        {
                            this.forzarEliminacion(id);
                        }
                    }
                    else
                    {
                        this.error = 'Error al eliminar: ' + (err.error || err.message);
                    }
                }
            }
        );
    }

    forzarEliminacion(id: number) 
    {
        this.adminService.eliminarCategoria(id, true).subscribe
        (
            {
                next: (resp) => 
                {
                    this.mensaje = 'Categoría y sus relaciones eliminadas correctamente.';
                    this.cargarCategorias();
                },
                error: (err) => this.error = 'No se pudo eliminar ni forzando: ' + err.error
            }
        );
    }

    limpiarFormulario()
    {
        this.categoriaSeleccionada = { idCategoria: 0, nombreCategoria: '' };
        this.modoEdicion = false;
        setTimeout(() => { this.mensaje = ''; this.error = ''; }, 3000);
    }
}