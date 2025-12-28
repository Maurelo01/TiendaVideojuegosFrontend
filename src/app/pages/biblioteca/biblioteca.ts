import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuarioServices/UsuarioService';
import { Biblioteca } from '../../../models/biblioteca';

@Component({
    selector: 'app-biblioteca',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './biblioteca.html',
    styleUrls: ['./biblioteca.css']
})
export class BibliotecaComponent implements OnInit 
{
    misJuegos: Biblioteca[] = [];
    cargando: boolean = true;
    error: string = '';

    constructor(
        private authService: AuthService,
        private usuarioService: UsuarioService,
        private router: Router
    ) { }

    ngOnInit(): void 
    {
        const usuario = this.authService.obtenerUsuarioActual();

        if (usuario && usuario.rol === 'GAMER' && usuario.idUsuario)
        {
            this.cargarBiblioteca(usuario.idUsuario);
        }
        else
        {
            this.router.navigate(['/home']);
        }
    }

    cargarBiblioteca(idUsuario: number)
    {
        this.cargando = true;
        this.usuarioService.obtenerBiblioteca(idUsuario).subscribe
        (
            {
                next: (data) => 
                {
                    this.misJuegos = data;
                    this.cargando = false;
                },
                error: (err) => 
                {
                    console.error(err);
                    this.error = 'No se pudo cargar tu biblioteca.';
                    this.cargando = false;
                }
            }
        );
    }

    descargarJuego(juego: Biblioteca)
    {
        if (juego.estadoInstalacion === 'INSTALADO')
        {
            alert('Ejecutando ' + juego.titulo + '...');
            return;
        }
        const usuario = this.authService.obtenerUsuarioActual();
        if (!usuario || !usuario.idUsuario) return;
        const confirmar = confirm(`¿Deseas descargar e instalar "${juego.titulo}"?`);
        if (confirmar)
        {
            alert('Iniciando descarga de ' + juego.titulo + '... Por favor espera.');
            this.usuarioService.instalarJuego(usuario.idUsuario, juego.idJuego).subscribe
            (
                {
                    next: () => 
                    {
                        juego.estadoInstalacion = 'INSTALADO';
                        alert(`¡${juego.titulo} se ha instalado correctamente!`);
                    },
                    error: (err) => 
                    {
                        console.error(err);
                        alert('Error en la instalación: ' + (err.error?.mensaje || 'Intente más tarde'));
                    }
                }
            );
        }
    }
    
    eliminarJuego(juego: Biblioteca)
    {
        const usuario = this.authService.obtenerUsuarioActual();
        if (!usuario || !usuario.idUsuario) return;
        if (confirm(`¿Estás seguro de desinstalar "${juego.titulo}"?`)) 
        {
            this.usuarioService.desinstalarJuego(usuario.idUsuario, juego.idJuego).subscribe
            (
                {
                    next: () => 
                    {
                        juego.estadoInstalacion = 'NO_INSTALADO'; // Actualizamos visualmente
                        alert('Juego desinstalado. Puedes volver a descargarlo cuando quieras.');
                    },
                    error: (err) => 
                    {
                        console.error(err);
                        alert('Error al desinstalar: ' + (err.error?.mensaje || 'Intente más tarde'));
                    }
                }
            );
        }
    }
}