export interface Usuario 
{
    idUsuario?: number;
    correo: string;
    rol: string; // 'ADMIN', 'EMPRESA', 'GAMER'
    fechaRegistro?: string;
}