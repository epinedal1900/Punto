/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarcarLeidos
// ====================================================

export interface MarcarLeidos_marcarLeidos {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface MarcarLeidos {
  marcarLeidos: MarcarLeidos_marcarLeidos;
}

export interface MarcarLeidosVariables {
  in: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: enviarReporteUrl
// ====================================================

export interface enviarReporteUrl_enviarReporteUrl {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface enviarReporteUrl {
  enviarReporteUrl: enviarReporteUrl_enviarReporteUrl;
}

export interface enviarReporteUrlVariables {
  chat: Chat;
  url: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: desactivarPlazaConInventario
// ====================================================

export interface desactivarPlazaConInventario_desactivarPlazaConInventario {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface desactivarPlazaConInventario {
  desactivarPlazaConInventario: desactivarPlazaConInventario_desactivarPlazaConInventario;
}

export interface desactivarPlazaConInventarioVariables {
  in: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: cancelarVentaPunto
// ====================================================

export interface cancelarVentaPunto_cancelarVentaPunto {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface cancelarVentaPunto {
  cancelarVentaPunto: cancelarVentaPunto_cancelarVentaPunto;
}

export interface cancelarVentaPuntoVariables {
  _idVenta: string;
  puntoId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: cancelarVenta
// ====================================================

export interface cancelarVenta_cancelarVenta {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface cancelarVenta {
  cancelarVenta: cancelarVenta_cancelarVenta;
}

export interface cancelarVentaVariables {
  _idVenta: string;
  nombre: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: subirDatos
// ====================================================

export interface subirDatos_subirDatos_erroresIds {
  gasto: string[];
  intercambio: string[];
  pago: string[];
  venta_cliente: string[];
  venta_punto: string[];
}

export interface subirDatos_subirDatos_usuario {
  _id: string;
  _idPunto: string | null;
  _idPuntoPrincipal: string;
  idInventario: string | null;
  infoPunto: string;
  sinAlmacen: boolean;
}

export interface subirDatos_subirDatos {
  erroresIds: subirDatos_subirDatos_erroresIds;
  message: string;
  success: boolean;
  usuario: subirDatos_subirDatos_usuario | null;
}

export interface subirDatos {
  subirDatos: subirDatos_subirDatos;
}

export interface subirDatosVariables {
  intercambio: intercambioVariables[];
  venta_punto: ventaPuntoVariables[];
  venta_cliente: ventaClienteVariables[];
  pago: pagoVariables[];
  gasto: gastoVariables[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: cancelarPago
// ====================================================

export interface cancelarPago_cancelarPago {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface cancelarPago {
  cancelarPago: cancelarPago_cancelarPago;
}

export interface cancelarPagoVariables {
  _idPago: string;
  nombre: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: cancelarIntercambio
// ====================================================

export interface cancelarIntercambio_cancelarIntercambio {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface cancelarIntercambio {
  cancelarIntercambio: cancelarIntercambio_cancelarIntercambio;
}

export interface cancelarIntercambioVariables {
  puntoId: string;
  _idIntercambio: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: nuevaVentaCliente
// ====================================================

export interface nuevaVentaCliente_nuevaVentaCliente {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface nuevaVentaCliente {
  nuevaVentaCliente: nuevaVentaCliente_nuevaVentaCliente;
}

export interface nuevaVentaClienteVariables {
  args: NuevaVentaArgs;
  nombre: string;
  puntoId: string;
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: nuevaVentaPuntoDeVenta
// ====================================================

export interface nuevaVentaPuntoDeVenta_nuevaVentaPuntoDeVenta {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface nuevaVentaPuntoDeVenta {
  nuevaVentaPuntoDeVenta: nuevaVentaPuntoDeVenta_nuevaVentaPuntoDeVenta;
}

export interface nuevaVentaPuntoDeVentaVariables {
  args: NuevaVentaPuntoArgs;
  puntoId: string;
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: nuevoIntercambio
// ====================================================

export interface nuevoIntercambio_nuevoIntercambio {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface nuevoIntercambio {
  nuevoIntercambio: nuevoIntercambio_nuevoIntercambio;
}

export interface nuevoIntercambioVariables {
  prendas: PrendasNuevoRegistro[];
  puntoIdReceptor: string;
  puntoIdEmisor: string;
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NuevoGasto
// ====================================================

export interface NuevoGasto_nuevoGasto {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface NuevoGasto {
  nuevoGasto: NuevoGasto_nuevoGasto;
}

export interface NuevoGastoVariables {
  gasto: GastoInput;
  puntoId: string;
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: reportarError
// ====================================================

export interface reportarError {
  reportarError: number | null;
}

export interface reportarErrorVariables {
  operation?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: nuevoRegistroDeInventario
// ====================================================

export interface nuevoRegistroDeInventario_nuevoRegistroDeInventario {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface nuevoRegistroDeInventario {
  nuevoRegistroDeInventario: nuevoRegistroDeInventario_nuevoRegistroDeInventario;
}

export interface nuevoRegistroDeInventarioVariables {
  articulos: PrendasNuevoRegistro[];
  discrepancias: PrendasNuevoRegistro[];
  _id: string;
  nombre: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: nuevoPago
// ====================================================

export interface nuevoPago_nuevoPago {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface nuevoPago {
  nuevoPago: nuevoPago_nuevoPago;
}

export interface nuevoPagoVariables {
  obj: ObjNuevoPago;
  nombre: string;
  puntoId: string;
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: calendarioRegistrosInventario
// ====================================================

export interface calendarioRegistrosInventario_calendarioRegistrosInventario_dias_prendas {
  id: string;
  reg: boolean | null;
}

export interface calendarioRegistrosInventario_calendarioRegistrosInventario_dias {
  prendas: calendarioRegistrosInventario_calendarioRegistrosInventario_dias_prendas[];
  fecha: string;
}

export interface calendarioRegistrosInventario_calendarioRegistrosInventario {
  dias: calendarioRegistrosInventario_calendarioRegistrosInventario_dias[] | null;
}

export interface calendarioRegistrosInventario {
  calendarioRegistrosInventario: calendarioRegistrosInventario_calendarioRegistrosInventario | null;
}

export interface calendarioRegistrosInventarioVariables {
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Usuario
// ====================================================

export interface Usuario_usuario_roles {
  role: string;
  readOnly: boolean;
}

export interface Usuario_usuario {
  _id: string;
  nombre: string;
  roles: Usuario_usuario_roles[];
  idInventario: string | null;
  _idPunto: string | null;
  infoPunto: string;
  _idPuntoPrincipal: string;
  clientes: (string | null)[] | null;
  sinAlmacen: boolean;
}

export interface Usuario {
  usuario: Usuario_usuario | null;
}

export interface UsuarioVariables {
  uid: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NotificacionesPunto
// ====================================================

export interface NotificacionesPunto_notificacionesPunto_notificaciones_notificaciones {
  _id: string;
  nombre: string;
  leido: boolean;
}

export interface NotificacionesPunto_notificacionesPunto_notificaciones {
  nombre: string;
  notificaciones: NotificacionesPunto_notificacionesPunto_notificaciones_notificaciones[];
}

export interface NotificacionesPunto_notificacionesPunto {
  notificaciones: NotificacionesPunto_notificacionesPunto_notificaciones[] | null;
}

export interface NotificacionesPunto {
  notificacionesPunto: NotificacionesPunto_notificacionesPunto | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NuevaVentaUtils
// ====================================================

export interface NuevaVentaUtils_clientes {
  _id: any;
  nombre: string;
}

export interface NuevaVentaUtils_productos_productos {
  _id: any;
  codigo: string;
  nombre: string;
  precio: number;
}

export interface NuevaVentaUtils_productos {
  productos: NuevaVentaUtils_productos_productos[] | null;
}

export interface NuevaVentaUtils_puntosActivos_plazasConInventarios {
  id: string | null;
  in: string;
  nombre: string | null;
}

export interface NuevaVentaUtils_puntosActivos {
  plazasConInventarios: NuevaVentaUtils_puntosActivos_plazasConInventarios[] | null;
}

export interface NuevaVentaUtils {
  clientes: NuevaVentaUtils_clientes[];
  productos: NuevaVentaUtils_productos | null;
  puntosActivos: NuevaVentaUtils_puntosActivos | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: nuevoRegistroInventarioUtils
// ====================================================

export interface nuevoRegistroInventarioUtils_inventario {
  encrypted: string | null;
}

export interface nuevoRegistroInventarioUtils_productos_productos {
  _id: any;
  codigo: string;
  nombre: string;
  precio: number;
}

export interface nuevoRegistroInventarioUtils_productos {
  productos: nuevoRegistroInventarioUtils_productos_productos[] | null;
}

export interface nuevoRegistroInventarioUtils {
  inventario: nuevoRegistroInventarioUtils_inventario | null;
  productos: nuevoRegistroInventarioUtils_productos | null;
  prendasPorRegistrar: string[];
}

export interface nuevoRegistroInventarioUtilsVariables {
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Inventario
// ====================================================

export interface Inventario_inventario_inv_pqs {
  p: string;
  c: number;
  id: string;
  proceso: string;
  tela: string;
}

export interface Inventario_inventario_inv {
  codigo: string;
  nombre: string;
  a: string;
  c: number;
  pqs: Inventario_inventario_inv_pqs[];
}

export interface Inventario_inventario {
  inv: Inventario_inventario_inv[] | null;
}

export interface Inventario {
  inventario: Inventario_inventario | null;
}

export interface InventarioVariables {
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: plaza
// ====================================================

export interface plaza_productos_productos {
  _id: any;
  codigo: string;
  nombre: string;
  precio: number;
}

export interface plaza_productos {
  productos: plaza_productos_productos[] | null;
}

export interface plaza_plaza_intercambios_ar_pqs {
  p: string;
  c: number;
}

export interface plaza_plaza_intercambios_ar {
  a: string;
  c: number;
  pqs: plaza_plaza_intercambios_ar_pqs[];
}

export interface plaza_plaza_intercambios_discrepancias_pqs {
  p: string;
  c: number;
}

export interface plaza_plaza_intercambios_discrepancias {
  a: string;
  c: number;
  pqs: plaza_plaza_intercambios_discrepancias_pqs[];
}

export interface plaza_plaza_intercambios {
  _id: any;
  esEmision: boolean | null;
  Fecha: string;
  Envia: string;
  Recibe: string;
  ar: plaza_plaza_intercambios_ar[];
  discrepancias: plaza_plaza_intercambios_discrepancias[] | null;
  ca: boolean;
}

export interface plaza_plaza_ventas_ar_pqs {
  p: any;
  c: number;
  dev: number | null;
  mod: number | null;
}

export interface plaza_plaza_ventas_ar {
  a: any;
  c: number;
  pqs: plaza_plaza_ventas_ar_pqs[];
  p: number;
  dev: number | null;
  mod: number | null;
}

export interface plaza_plaza_ventas {
  _id: any;
  Fecha: string;
  Nombre: string | null;
  ar: plaza_plaza_ventas_ar[];
  ca: boolean;
  Monto: number;
  Comentarios: string;
}

export interface plaza_plaza_pagos {
  _id: any;
  cliente: string;
  Fecha: string;
  Nombre: string;
  Tipo: string;
  Monto: number;
  Comentarios: string | null;
  ca: boolean | null;
}

export interface plaza_plaza_gastos {
  _id: any;
  Fecha: string;
  Descripcion: string;
  Monto: number;
}

export interface plaza_plaza {
  fecha: string;
  nombre: string;
  ce: boolean | null;
  re: number | null;
  path: string | null;
  idInventario: any | null;
  intercambios: plaza_plaza_intercambios[] | null;
  ventas: plaza_plaza_ventas[] | null;
  pagos: plaza_plaza_pagos[];
  gastos: plaza_plaza_gastos[];
}

export interface plaza {
  productos: plaza_productos | null;
  plaza: plaza_plaza | null;
}

export interface plazaVariables {
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NuevoPagoUtils
// ====================================================

export interface NuevoPagoUtils_clientes {
  _id: any;
  nombre: string;
}

export interface NuevoPagoUtils {
  clientes: NuevoPagoUtils_clientes[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Productos
// ====================================================

export interface Productos_productos_productos {
  _id: any;
  codigo: string;
  nombre: string;
  precio: number;
}

export interface Productos_productos {
  productos: Productos_productos_productos[] | null;
}

export interface Productos {
  productos: Productos_productos | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum Chat {
  cuentasProduccion = "cuentasProduccion",
  produccion = "produccion",
  ventas = "ventas",
}

export enum TipoDePago {
  cheque = "cheque",
  deposito = "deposito",
  descuento = "descuento",
  efectivo = "efectivo",
  prestamo = "prestamo",
}

export interface GastoInput {
  mo: number;
  de: string;
}

export interface NuevaVentaArgs {
  cl: string;
  in: string;
  prendas: PrendasNuevaVenta[];
  co?: string | null;
  di?: string | null;
}

export interface NuevaVentaPuntoArgs {
  in: string;
  prendas: PrendasNuevaVenta[];
  co?: string | null;
}

export interface ObjNuevoPago {
  cl: string;
  mo: number;
  ti: TipoDePago;
  path?: string[] | null;
  cu?: string | null;
  co?: string | null;
  col?: string | null;
}

export interface PQs {
  p: string;
  c: number;
  pqAPrendaSuelta?: number | null;
}

export interface PrendasNuevaVenta {
  a: string;
  c: number;
  pqs: PQs[];
  p: number;
}

export interface PrendasNuevoRegistro {
  a: string;
  c: number;
  pqs: PQs[];
}

export interface gastoVariables {
  gasto: GastoInput;
  puntoId: string;
  _id: string;
}

export interface intercambioVariables {
  prendas: PrendasNuevoRegistro[];
  puntoIdReceptor: string;
  puntoIdEmisor: string;
  _id: string;
}

export interface pagoVariables {
  obj: ObjNuevoPago;
  nombre: string;
  puntoId: string;
  _id: string;
}

export interface ventaClienteVariables {
  args: NuevaVentaArgs;
  nombre: string;
  puntoId: string;
  _id: string;
}

export interface ventaPuntoVariables {
  args: NuevaVentaPuntoArgs;
  puntoId: string;
  _id: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
