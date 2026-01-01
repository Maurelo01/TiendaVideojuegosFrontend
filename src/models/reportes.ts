import { Comentario } from "./comentario";

export interface ReporteVentasEmpresa
{
    tituloJuego: string;
    copiasVendidas: number;
    ingresosBrutos: number;
    comisionPlataforma: number;
    gananciaNeta: number;
}

export interface ReporteAdmin
{
    nombreEmpresa: string;
    totalVentas: number;
    totalIngresos: number;
    gananciaPlataforma: number;
    gananciaEmpresa: number;
}

export interface JuegoCalificacion 
{
    titulo: string;
    promedio: number;
    totalResenas: number;
}

export interface ReporteFeedback 
{
    promedios: JuegoCalificacion[];
    topComentarios: Comentario[];
    peoresComentarios: Comentario[];
}