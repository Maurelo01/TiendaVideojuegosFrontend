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