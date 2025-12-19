export interface Usuario 
{
    idUsuario?: number;
    correo: string;
    contraseña: string;
    rol: string; // 'ADMIN', 'EMPRESA', 'GAMER'
    fechaRegistro?: string;
}