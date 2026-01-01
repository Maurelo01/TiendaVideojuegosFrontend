export interface Comentario
{
    idComentario?: number;
    idGamer: number;
    idJuego: number;
    idComentarioPrincipal?: number;
    nicknameGamer?: string;
    texto: string;
    calificacion: number;
    fecha?: string;
    esMio?: boolean; 
    respuestas?: Comentario[];
    oculto?: boolean;
}