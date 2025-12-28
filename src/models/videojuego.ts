export interface Videojuego 
{
    idJuego: number;
    idEmpresa: number;
    titulo: string;
    descripcion: string;
    precio: number;
    recursosMinimos: string;
    clasificacionEdad: string;
    estado: string;
    imagen?: string;
}

export interface Multimedia 
{
    idMedia?: number;
    idJuego?: number;
    contenido: string;
    tipo: 'IMAGEN' | 'VIDEO';
}