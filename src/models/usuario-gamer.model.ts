import { Usuario } from "./usuario.model";

export interface UsuarioGamer extends Usuario 
{
    nickname: string;
    fechaNacimiento: string;
    telefono?: string;
    pais?: string;
    saldoCartera?: number;
}