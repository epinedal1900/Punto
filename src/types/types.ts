/* eslint-disable @typescript-eslint/naming-convention */
import { FormikErrors } from 'formik';
import {
  NuevaVentaUtils_clientes,
  NuevaVentaUtils_puntosActivos_plazasConInventarios,
  Productos_productos_productos,
} from './apollo';

export interface DatosTablaPrendas {
  Nombre: string;
  Cantidad: number;
  Precio?: number;
}

export interface ImpresionDeTicketsArgs {
  infoPunto: string;
  articulos: DatosTablaPrendas[];
  cliente: string | null;
  cantidadPagada: number | null;
  cambio: number | null;
  fecha?: string;
}
export interface ImpresionDeTicketsSinPreciosArgs {
  infoPunto: string;
  articulos: PrendasRevision[];
  fecha?: string;
}

export interface SessionState {
  loggedIn: boolean;
  nombre: string | null;
  roles: Role[] | null;
  uid: string | null;
}
export interface PlazaState {
  idInventario: string | null;
  _idPunto: string | null;
  _idPuntoPrincipal: string | null;
  sinAlmacen: boolean;
  infoPunto: string | null;
  online: boolean;
  ultimoTicket: Required<ImpresionDeTicketsArgs> | null;
  impresora: string | null;
  ancho: string | null;
}

export type AppRole =
  | 'ADMIN'
  | 'VENTAS'
  | 'PRODUCCION'
  | 'EN_PRODUCCION'
  | 'INTERCAMBIOS'
  | 'PLAZA'
  | 'INVENTARIO'
  | 'FOTOS'
  | 'PEDIDOS'
  | 'CONFIRMACION_PRODUCCION'
  | 'CONFIRMACION_INVENTARIO';

export interface Role {
  role: AppRole;
  readOnly: boolean;
}
export interface PqsRevision {
  c: number;
  pqAPrendaSuelta?: number;
  id: string;
  p: string;
}

export interface PrendasRevision {
  a: string;
  c: number;
  nombre: string;
  pqs: PqsRevision[];
  p?: number;
}

export interface PrendasInventario {
  [x: string]: any;
  pqs: { [x: string]: any; c: number; p: string }[];
  c: number;
  a: string;
}
export interface Precios {
  nombre: string;
  _id: string;
  precio: number;
}
export interface Qr {
  qr: string;
  id: string;
  tallas: string;
  piezas: number;
  cantidad: number;
  nombre: string;
}
export interface PrendaSuelta {
  articulo: Productos_productos_productos;
  cantidad: number;
}
export interface ArticulosValues {
  escaneos: Qr[];
  prendasSueltas: PrendaSuelta[];
  paquetesAbiertos: Qr[];
  precios: Precios[];
}

export interface Ticket extends ArticulosValues {
  _id: string;
  esMenudeo: boolean;
  cliente: NuevaVentaUtils_clientes | '';
  articulo: Productos_productos_productos | '';
  cantidad: number;
  tipoDePago: 'efectivo' | 'pendiente';
  tipoDeImpresion: 'imprimir' | 'noImprimir' | 'imprimirA5';
  comentarios: string;
  cantidadPagada: number;
}
export interface PrincipalValues extends Ticket {
  intercambioValues: IntercambioValues;
}

export interface GastoValues {
  tipoDeGasto: string;
  especificar: string;
  monto: number;
}
export interface IntercambioValues extends ArticulosValues {
  tipoDeImpresion: 'imprimir' | 'noImprimir';
  plazaReceptora: NuevaVentaUtils_puntosActivos_plazasConInventarios | '';
}
export interface PagoValues {
  cliente: NuevaVentaUtils_clientes | '';
  monto: number;
  comentarios: string;
}
export interface ImpresoraValues {
  impresora: string;
  ancho: string;
}

export interface NombreTickets {
  _id: string;
  nombre: string | null;
}
export type FormikSetFieldValue = (
  field: string,
  value: any,
  shouldValidate?: boolean
) => void;

export type FormikSetValues<Values> = (
  values: React.SetStateAction<Values>,
  shouldValidate?: boolean
) => void;
export type FormikSetErrors<Values> = (errors: FormikErrors<Values>) => void;
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export interface Info {
  key: string;
  value: any;
}
export interface InfoRaw {
  [x: string]: any;
}
