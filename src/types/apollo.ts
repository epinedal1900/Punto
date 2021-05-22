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
  nombre: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EnviarReporteUrl
// ====================================================

export interface EnviarReporteUrl_enviarReporteUrl {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface EnviarReporteUrl {
  enviarReporteUrl: EnviarReporteUrl_enviarReporteUrl;
}

export interface EnviarReporteUrlVariables {
  url: string;
  nombre: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ModificarPuntosActivos
// ====================================================

export interface ModificarPuntosActivos_modificarPuntosActivos {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface ModificarPuntosActivos {
  modificarPuntosActivos: ModificarPuntosActivos_modificarPuntosActivos;
}

export interface ModificarPuntosActivosVariables {
  nombre: string;
  propiedad: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NuevoCliente
// ====================================================

export interface NuevoCliente_nuevoCliente {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface NuevoCliente {
  nuevoCliente: NuevoCliente_nuevoCliente;
}

export interface NuevoClienteVariables {
  obj: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CancelarMovimiento
// ====================================================

export interface CancelarMovimiento_cancelarMovimiento {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface CancelarMovimiento {
  cancelarMovimiento: CancelarMovimiento_cancelarMovimiento;
}

export interface CancelarMovimientoVariables {
  nombre: string;
  puntoId: string;
  idMovimiento: string;
  movimiento: string;
  articulos: any;
  message: string;
  conCliente?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CancelarPago
// ====================================================

export interface CancelarPago_cancelarPago {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface CancelarPago {
  cancelarPago: CancelarPago_cancelarPago;
}

export interface CancelarPagoVariables {
  _idCollection: string;
  _idCliente: string;
  cliente: string;
  monto: number;
  esDescuento?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NuevoPedido
// ====================================================

export interface NuevoPedido_nuevoPedido {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface NuevoPedido {
  nuevoPedido: NuevoPedido_nuevoPedido;
}

export interface NuevoPedidoVariables {
  obj: any;
  cliente: string;
  prendas: number;
  urls?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NuevaVenta
// ====================================================

export interface NuevaVenta_nuevaVenta {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface NuevaVenta {
  nuevaVenta: NuevaVenta_nuevaVenta;
}

export interface NuevaVentaVariables {
  objVenta: any;
  monto?: number | null;
  cliente?: string | null;
  puntoId?: string | null;
  nombre?: string | null;
  idPago?: string | null;
  enviarMensaje?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NuevoIntercambio
// ====================================================

export interface NuevoIntercambio_nuevoIntercambio {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface NuevoIntercambio {
  nuevoIntercambio: NuevoIntercambio_nuevoIntercambio;
}

export interface NuevoIntercambioVariables {
  obj: any;
  nombreSalida: string;
  nombreEntrada: string;
  enviarMensaje?: boolean | null;
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
  obj: any;
  puntoId: string;
  enviarMensaje?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NuevoRegreso
// ====================================================

export interface NuevoRegreso_nuevoRegreso {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface NuevoRegreso {
  nuevoRegreso: NuevoRegreso_nuevoRegreso;
}

export interface NuevoRegresoVariables {
  obj: any;
  puntoId: string;
  nombre: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegistrarDiscrepancias
// ====================================================

export interface RegistrarDiscrepancias_registrarDiscrepancias {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface RegistrarDiscrepancias {
  registrarDiscrepancias: RegistrarDiscrepancias_registrarDiscrepancias;
}

export interface RegistrarDiscrepanciasVariables {
  articulos: any[];
  puntoId: string;
  tipo: string;
  nombre?: string | null;
  sobrescribir?: any[] | null;
  entradaId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NuevoPago
// ====================================================

export interface NuevoPago_nuevoPago {
  success: boolean;
  message: string | null;
  _id: string | null;
}

export interface NuevoPago {
  nuevoPago: NuevoPago_nuevoPago;
}

export interface NuevoPagoVariables {
  objPago: any;
  cliente: string;
  urls?: string[] | null;
  puntoId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Usuario
// ====================================================

export interface Usuario_usuario {
  _id: string;
  nombre: string;
  roles: any[];
  infoPunto: string | null;
  sinAlmacen: boolean | null;
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
// GraphQL query operation: PuntoIdActivo
// ====================================================

export interface PuntoIdActivo {
  puntoIdActivo: string | null;
}

export interface PuntoIdActivoVariables {
  nombre: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NotificacionesPunto
// ====================================================

export interface NotificacionesPunto {
  notificacionesPunto: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Clientes
// ====================================================

export interface Clientes_clientes {
  _id: string;
  Nombre: string;
  Telefono: string | null;
  Balance: string | null;
}

export interface Clientes {
  clientes: Clientes_clientes[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Cliente
// ====================================================

export interface Cliente_cliente_direcciones {
  Direccion: string;
  CP: string;
  Estado: string;
}

export interface Cliente_cliente {
  Nombre: string;
  Telefono1: string | null;
  Telefono2: string | null;
  Correo: string | null;
  direcciones: Cliente_cliente_direcciones[] | null;
}

export interface Cliente {
  cliente: Cliente_cliente | null;
}

export interface ClienteVariables {
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NuevaVentaUtils
// ====================================================

export interface NuevaVentaUtils_clientes {
  _id: string;
  nombre: string;
}

export interface NuevaVentaUtils_productos {
  objects: any[] | null;
}

export interface NuevaVentaUtils {
  clientes: NuevaVentaUtils_clientes[] | null;
  productos: NuevaVentaUtils_productos | null;
}

export interface NuevaVentaUtilsVariables {
  _idProductos: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NuevoRegistroInventarioUtils
// ====================================================

export interface NuevoRegistroInventarioUtils_inventario_inventario {
  articulo: string;
  cantidad: number;
}

export interface NuevoRegistroInventarioUtils_inventario {
  fecha: string;
  inventario: NuevoRegistroInventarioUtils_inventario_inventario[];
}

export interface NuevoRegistroInventarioUtils_productos {
  objects: any[] | null;
}

export interface NuevoRegistroInventarioUtils {
  inventario: NuevoRegistroInventarioUtils_inventario | null;
  productos: NuevoRegistroInventarioUtils_productos | null;
}

export interface NuevoRegistroInventarioUtilsVariables {
  _idProductos: string;
  nombre: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Ventas
// ====================================================

export interface Ventas_ventas {
  _id: string;
  Fecha: string | null;
  Nombre: string | null;
  Monto: number;
  Tipo: string | null;
}

export interface Ventas {
  ventas: Ventas_ventas[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Inventario
// ====================================================

export interface Inventario_inventario_inventario {
  articulo: string;
  cantidad: number;
}

export interface Inventario_inventario {
  inventario: Inventario_inventario_inventario[];
}

export interface Inventario {
  inventario: Inventario_inventario | null;
}

export interface InventarioVariables {
  nombre: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Movimientos
// ====================================================

export interface Movimientos_movimientos_movimientos_articulos {
  articulo: string;
  cantidad: number;
  precio: number | null;
}

export interface Movimientos_movimientos_movimientos {
  _id: string | null;
  Fecha: string;
  Tipo: string;
  Monto: number;
  Pago: number | null;
  Prendas: number;
  articulos: Movimientos_movimientos_movimientos_articulos[] | null;
  comentarios: string | null;
}

export interface Movimientos_movimientos_gastos {
  Fecha: string;
  Descripcion: string;
  Monto: number;
}

export interface Movimientos_movimientos {
  fecha: string;
  movimientos: Movimientos_movimientos_movimientos[];
  gastos: Movimientos_movimientos_gastos[];
}

export interface Movimientos {
  movimientos: Movimientos_movimientos | null;
}

export interface MovimientosVariables {
  _id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DetallesMovimientosUtils
// ====================================================

export interface DetallesMovimientosUtils_movimientos_movimientos_articulos {
  articulo: string;
  cantidad: number;
  precio: number | null;
}

export interface DetallesMovimientosUtils_movimientos_movimientos {
  _id: string | null;
  Fecha: string;
  Tipo: string;
  Monto: number;
  Pago: number | null;
  Prendas: number;
  articulos: DetallesMovimientosUtils_movimientos_movimientos_articulos[] | null;
  comentarios: string | null;
}

export interface DetallesMovimientosUtils_movimientos_gastos {
  Fecha: string;
  Descripcion: string;
  Monto: number;
}

export interface DetallesMovimientosUtils_movimientos {
  fecha: string;
  movimientos: DetallesMovimientosUtils_movimientos_movimientos[];
  gastos: DetallesMovimientosUtils_movimientos_gastos[];
}

export interface DetallesMovimientosUtils_productos {
  objects: any[] | null;
}

export interface DetallesMovimientosUtils {
  movimientos: DetallesMovimientosUtils_movimientos | null;
  productos: DetallesMovimientosUtils_productos | null;
}

export interface DetallesMovimientosUtilsVariables {
  _id: string;
  _idProductos: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NuevoPagoUtils
// ====================================================

export interface NuevoPagoUtils_clientes {
  _id: string;
  nombre: string;
}

export interface NuevoPagoUtils_cuentas {
  values: string[] | null;
}

export interface NuevoPagoUtils {
  clientes: NuevoPagoUtils_clientes[] | null;
  cuentas: NuevoPagoUtils_cuentas | null;
}

export interface NuevoPagoUtilsVariables {
  _idCuentas: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Otros
// ====================================================

export interface Otros_cuentas {
  values: string[] | null;
}

export interface Otros_productos {
  objects: any[] | null;
}

export interface Otros {
  cuentas: Otros_cuentas | null;
  productos: Otros_productos | null;
}

export interface OtrosVariables {
  _idCuentas: string;
  _idProductos: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Cuentas
// ====================================================

export interface Cuentas_cuentas {
  values: string[] | null;
}

export interface Cuentas {
  cuentas: Cuentas_cuentas | null;
}

export interface CuentasVariables {
  _idCuentas: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Productos
// ====================================================

export interface Productos_productos {
  objects: any[] | null;
}

export interface Productos {
  productos: Productos_productos | null;
}

export interface ProductosVariables {
  _idProductos: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
