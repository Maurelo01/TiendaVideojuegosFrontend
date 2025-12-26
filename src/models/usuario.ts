export interface Usuario 
{
    idUsuario?: number;
    correo: string;
    contraseña: string;
    rol: string; // 'ADMIN', 'EMPRESA', 'GAMER'
    fechaRegistro?: string;
    idEmpresa?: number;
    nickname?: string;
    nombreEmpleado?: string;
    nombreEmpresaAux?: string;
}