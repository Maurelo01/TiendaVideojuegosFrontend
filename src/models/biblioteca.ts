export interface Biblioteca
{
    idJuego: number;
    titulo: string;
    imagen: string;
    estadoInstalacion: string
    fechaAdquisicion: string;
    idPropietario?: number;
    nombrePropietario?: string;
}