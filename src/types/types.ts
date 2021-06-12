import { Articulos } from './graphql';

export interface ClienteForm {
  _id: string;
  nombre: string;
}
export interface ArticuloOption {
  codigo: string;
  nombre: string;
  precio: number;
}
export interface ArticuloForm {
  articulo: ArticuloOption;
  cantidad: number;
  precio: number;
}
export interface ArticuloDB {
  articulo: string;
  cantidad: number;
  precio: number;
}
export interface Ticket {
  cliente: ClienteForm | '';
  articulos: ArticuloForm[];
  esMenudeo?: boolean;
  nombre: string;
}
export interface UltimoTicket {
  infoPunto: string;
  articulos: ArticuloDB;
  cliente: string;
  cantidadPagada: number;
  cambio: number;
}
export interface Session {
  loggedIn: string;
  online: boolean;
  nombre: string;
  roles: string;
  puntoIdActivo: string;
  infoPunto: string;
  tickets: Ticket[];
  ultimoTicket: UltimoTicket;
  impresora: string;
  ancho: string;
  inventario: Articulos[];
  sinAlmacen: 'true' | 'false';
}
export type AppRole =
  | 'ADMIN'
  | 'VENTAS'
  | 'PRODUCCION'
  | 'EN_PRODUCCION'
  | 'PEDIDOS'
  | 'FOTOS'
  | 'PUNTO'
  | 'MOVIMIENTOS_PUNTO';

export interface Role {
  role: AppRole;
  readOnly: 'true' | 'false';
}

export interface PrincipalValues {
  articulos: ArticuloForm[];
  cliente: ClienteForm | '';
  articulo: ArticuloOption | '';
  cantidad: number;
  precio: number;
  tipoDePago: 'efectivo' | 'pendiente';
  tipoDeImpresion: 'imprimir' | 'noImprimir' | 'imprimirA5';
  comentarios: string;
  cantidadPagada: number;
}
export interface GastoValues {
  tipoDeGasto: string;
  especificar: string;
  monto: number;
}
export interface IntercambioValues {
  articulos: ArticuloForm[];
  tipoDeImpresion: 'imprimir' | 'noImprimir';
  comentarios: string;
}
export interface PagoValues {
  cliente: ClienteForm;
  monto: number;
  comentarios: string;
}
export interface ImpresoraValues {
  impresora: string;
  ancho: string;
}
