import { Usuario } from "./usuario";

export interface UsuarioGamer extends Usuario 
{
    nickname: string;
    fechaNacimiento: string;
    telefono?: string;
    pais?: string;
    saldoCartera?: number;
    avatar?: string;
}