import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuarioServices/UsuarioService';
import { VideojuegosService } from '../../../services/videojuegoServices/videojuegos';
import { Videojuego } from '../../../models/videojuego';

@Component({
    selector: 'app-perfil-empresa',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './perfil-empresa.html',
    styleUrls: ['./perfil-empresa.css']
})
export class PerfilEmpresaComponent implements OnInit
{
    empresa: any = null;
    juegos: Videojuego[] = [];
    cargando: boolean = true;
    idEmpresa: number = 0;

    constructor
    (
        private route: ActivatedRoute,
        private usuarioService: UsuarioService,
        private videojuegosService: VideojuegosService
    ) { }

    ngOnInit(): void
    {
        this.route.params.subscribe(params => 
        {
                this.idEmpresa = +params['id'];
                if (this.idEmpresa)
                {
                    this.cargarDatosEmpresa();
                    this.cargarCatalogoEmpresa();
                }
            }
        );
    }

    cargarDatosEmpresa()
    {
        this.usuarioService.obtenerPerfilEmpresa(this.idEmpresa).subscribe
        (
            {
                next: (data) => this.empresa = data,
                error: (err) => console.error('Error cargando empresa', err)
            }
        );
    }

    cargarCatalogoEmpresa()
    {
        this.cargando = true;
        this.videojuegosService.obtenerPorEmpresa(this.idEmpresa).subscribe
        (
            {
                next: (data) => 
                {
                    this.juegos = data.filter(j => j.estado === 'ACTIVO');
                    this.cargando = false;
                },
                error: (err) => this.cargando = false
            }
        );
    }
}