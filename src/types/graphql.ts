import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  ObjectID: any;
};


export type Articulos = {
  __typename?: 'Articulos';
  codigo?: Maybe<Scalars['String']>;
  articulo: Scalars['String'];
  cantidad: Scalars['Int'];
  precio?: Maybe<Scalars['Float']>;
};

export type ArticulosVenta = {
  __typename?: 'ArticulosVenta';
  articulo: Scalars['String'];
  cantidad: Scalars['Float'];
  precio: Scalars['Float'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Corte = {
  __typename?: 'Corte';
  _id: Scalars['String'];
  folio: Scalars['String'];
  fecha?: Maybe<Scalars['String']>;
  prenda: Scalars['String'];
  tela: Scalars['String'];
  tallas: Scalars['String'];
  modelo: Scalars['String'];
  colores?: Maybe<Array<Scalars['JSON']>>;
  comentarios?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
  porMaq?: Maybe<Scalars['Int']>;
  porMaqArr?: Maybe<Array<Scalars['JSON']>>;
  porLav?: Maybe<Scalars['Int']>;
  porPla?: Maybe<Array<Scalars['JSON']>>;
  porRev?: Maybe<Array<Scalars['JSON']>>;
  porTer?: Maybe<Array<Scalars['JSON']>>;
  estatus?: Maybe<Scalars['String']>;
  completo?: Maybe<Scalars['Boolean']>;
  SMaq?: Maybe<Array<Salida>>;
  SLav?: Maybe<Array<Salida>>;
  SPla?: Maybe<Array<Salida>>;
  SRev?: Maybe<Array<Salida>>;
  STer?: Maybe<Array<Salida>>;
};

export type Direccion = {
  __typename?: 'Direccion';
  direccion: Scalars['String'];
  cp: Scalars['String'];
  estado: Scalars['String'];
};

export type Entrada = {
  __typename?: 'Entrada';
  _id?: Maybe<Scalars['ObjectID']>;
  fecha?: Maybe<Scalars['String']>;
  cantidad?: Maybe<Scalars['Int']>;
  perdidos?: Maybe<Scalars['Int']>;
  ids?: Maybe<Array<Scalars['JSON']>>;
};

export type EstadoDeCuenta = {
  __typename?: 'EstadoDeCuenta';
  _id: Scalars['String'];
  balance: Scalars['Float'];
  estado: Array<MovimientoDeCuenta>;
};

export type Gasto = {
  __typename?: 'Gasto';
  _id: Scalars['String'];
  fecha: Scalars['String'];
  descripcion: Scalars['String'];
  monto: Scalars['Float'];
};

export type Inventario = {
  __typename?: 'Inventario';
  fecha: Scalars['String'];
  inventario: Array<Articulos>;
  oid?: Maybe<Scalars['ObjectID']>;
};


export type Movimiento = {
  __typename?: 'Movimiento';
  _id?: Maybe<Scalars['String']>;
  fecha: Scalars['String'];
  tipo: Scalars['String'];
  pago?: Maybe<Scalars['Float']>;
  monto: Scalars['Float'];
  prendas: Scalars['Int'];
  articulos?: Maybe<Array<Articulos>>;
  comentarios?: Maybe<Scalars['String']>;
};

export type MovimientoDeCuenta = {
  __typename?: 'MovimientoDeCuenta';
  _id: Scalars['String'];
  fecha: Scalars['String'];
  descripcion: Scalars['String'];
  monto: Scalars['Float'];
  balance: Scalars['Float'];
};

export type Movimientos = {
  __typename?: 'Movimientos';
  fecha: Scalars['String'];
  punto: Scalars['String'];
  movimientos: Array<Movimiento>;
  gastos: Array<Gasto>;
  discrepancias: Array<Scalars['JSON']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  nuevoColaborador: MutationRes;
  editarColaborador: MutationRes;
  nuevoCorte: MutationRes;
  nuevaSalida: MutationRes;
  nuevaSalidaProcesos: MutationRes;
  nuevaEntrada: MutationRes;
  nuevaEntradaProcesos: MutationRes;
  eliminarCorte: MutationRes;
  editarPrecioSalida: MutationRes;
  eliminarSalida: MutationRes;
  eliminarSalidaProcesos: MutationRes;
  eliminarEntrada: MutationRes;
  eliminarEntradaProcesos: MutationRes;
  editarPreciosProcesos: MutationRes;
  editarProcesos: MutationRes;
  enviarFotoProduccion: MutationRes;
  modificarPuntosActivos: MutationRes;
  marcarLeidos: MutationRes;
  nuevoIntercambio: MutationRes;
  nuevoRegreso: MutationRes;
  cancelarMovimiento: MutationRes;
  nuevoGasto: MutationRes;
  registrarDiscrepancias: MutationRes;
  deleteObjectUtils: MutationRes;
  deleteValueUtils: MutationRes;
  addValueUtils: MutationRes;
  addObjectUtils: MutationRes;
  addDireccion: MutationRes;
  editarProductos: MutationRes;
  enviarReporteUrl: MutationRes;
  nuevoCliente: MutationRes;
  editarCliente: MutationRes;
  nuevoPago: MutationRes;
  nuevaVenta: MutationRes;
  nuevaSalidaMercancia: MutationRes;
  nuevoPedido: MutationRes;
  editarPedido: MutationRes;
  eliminarPedido: MutationRes;
  agregarVentaAPedido: MutationRes;
  cancelarPago: MutationRes;
  cancelarVenta: MutationRes;
  editarVenta: MutationRes;
  uploadEnvio: MutationRes;
};


export type MutationNuevoColaboradorArgs = {
  obj: Scalars['JSON'];
};


export type MutationEditarColaboradorArgs = {
  _idColaborador: Scalars['String'];
  telefonos: Array<Scalars['String']>;
  correo: Scalars['String'];
};


export type MutationNuevoCorteArgs = {
  obj: Scalars['JSON'];
};


export type MutationNuevaSalidaArgs = {
  obj: Scalars['JSON'];
  corte: Scalars['String'];
  tipo: Scalars['String'];
  folio: Scalars['String'];
  prenda: Scalars['String'];
  porArr?: Maybe<Array<Scalars['JSON']>>;
};


export type MutationNuevaSalidaProcesosArgs = {
  obj: Scalars['JSON'];
  corte: Scalars['String'];
  tipo: Scalars['String'];
  folio: Scalars['String'];
  prenda: Scalars['String'];
};


export type MutationNuevaEntradaArgs = {
  obj: Scalars['JSON'];
  corte: Scalars['String'];
  id: Scalars['String'];
  folio: Scalars['String'];
  nombre: Scalars['String'];
  prenda: Scalars['String'];
};


export type MutationNuevaEntradaProcesosArgs = {
  obj: Scalars['JSON'];
  corte: Scalars['String'];
  id: Scalars['String'];
  tipo: Scalars['String'];
  folio: Scalars['String'];
  nombre: Scalars['String'];
  prenda: Scalars['String'];
  procesosEntrada: Array<Scalars['JSON']>;
};


export type MutationEliminarCorteArgs = {
  corte: Scalars['String'];
  total: Scalars['Int'];
  prenda: Scalars['String'];
  folio: Scalars['String'];
};


export type MutationEditarPrecioSalidaArgs = {
  corte: Scalars['String'];
  movimiento: Scalars['String'];
  id: Scalars['String'];
  precio: Scalars['Float'];
};


export type MutationEliminarSalidaArgs = {
  corte: Scalars['String'];
  movimiento: Scalars['String'];
  id: Scalars['String'];
  nombre: Scalars['String'];
  prenda: Scalars['String'];
  folio: Scalars['String'];
};


export type MutationEliminarSalidaProcesosArgs = {
  corte: Scalars['String'];
  movimiento: Scalars['String'];
  id: Scalars['String'];
  nombre: Scalars['String'];
  prenda: Scalars['String'];
  folio: Scalars['String'];
};


export type MutationEliminarEntradaArgs = {
  corte: Scalars['String'];
  id: Scalars['String'];
  nombre: Scalars['String'];
  prenda: Scalars['String'];
  folio: Scalars['String'];
};


export type MutationEliminarEntradaProcesosArgs = {
  corte: Scalars['String'];
  movimiento: Scalars['String'];
  id: Scalars['String'];
  nombre: Scalars['String'];
  prenda: Scalars['String'];
  folio: Scalars['String'];
};


export type MutationEditarPreciosProcesosArgs = {
  corte: Scalars['String'];
  id: Scalars['String'];
  movimiento: Scalars['String'];
  preciosArr: Array<Scalars['JSON']>;
};


export type MutationEditarProcesosArgs = {
  corte: Scalars['String'];
  id: Scalars['String'];
  procesosArr: Array<Scalars['JSON']>;
};


export type MutationEnviarFotoProduccionArgs = {
  url: Scalars['String'];
};


export type MutationModificarPuntosActivosArgs = {
  nombre: Scalars['String'];
  propiedad: Scalars['String'];
};


export type MutationMarcarLeidosArgs = {
  nombre: Scalars['String'];
};


export type MutationNuevoIntercambioArgs = {
  obj: Scalars['JSON'];
  nombreSalida: Scalars['String'];
  nombreEntrada: Scalars['String'];
  enviarMensaje?: Maybe<Scalars['Boolean']>;
};


export type MutationNuevoRegresoArgs = {
  obj: Scalars['JSON'];
  puntoId: Scalars['String'];
  nombre: Scalars['String'];
};


export type MutationCancelarMovimientoArgs = {
  articulos: Scalars['JSON'];
  puntoId: Scalars['String'];
  nombre: Scalars['String'];
  idMovimiento: Scalars['String'];
  message: Scalars['String'];
  movimiento?: Maybe<Scalars['String']>;
  conCliente?: Maybe<Scalars['Boolean']>;
};


export type MutationNuevoGastoArgs = {
  obj: Scalars['JSON'];
  puntoId: Scalars['String'];
  enviarMensaje?: Maybe<Scalars['Boolean']>;
};


export type MutationRegistrarDiscrepanciasArgs = {
  articulos: Array<Scalars['JSON']>;
  puntoId: Scalars['String'];
  tipo: Scalars['String'];
  sobrescribir?: Maybe<Array<Scalars['JSON']>>;
  nombre?: Maybe<Scalars['String']>;
  entradaId?: Maybe<Scalars['String']>;
  puntoId2?: Maybe<Scalars['String']>;
};


export type MutationDeleteObjectUtilsArgs = {
  _id: Scalars['String'];
  object: Scalars['JSON'];
  message: Scalars['String'];
};


export type MutationDeleteValueUtilsArgs = {
  _id: Scalars['String'];
  value: Scalars['String'];
  message: Scalars['String'];
};


export type MutationAddValueUtilsArgs = {
  _id: Scalars['String'];
  value: Scalars['String'];
  message: Scalars['String'];
};


export type MutationAddObjectUtilsArgs = {
  _id: Scalars['String'];
  object: Scalars['JSON'];
  message: Scalars['String'];
};


export type MutationAddDireccionArgs = {
  collection: Scalars['String'];
  obj: Scalars['JSON'];
  _id: Scalars['String'];
};


export type MutationEditarProductosArgs = {
  _id: Scalars['String'];
  codigo: Scalars['String'];
  object: Scalars['JSON'];
  message: Scalars['String'];
};


export type MutationEnviarReporteUrlArgs = {
  nombre: Scalars['String'];
  url: Scalars['String'];
};


export type MutationNuevoClienteArgs = {
  obj: Scalars['JSON'];
};


export type MutationEditarClienteArgs = {
  _idCliente: Scalars['String'];
  telefonos: Array<Scalars['String']>;
  correo: Scalars['String'];
};


export type MutationNuevoPagoArgs = {
  obj: Scalars['JSON'];
  cliente: Scalars['String'];
  urls?: Maybe<Array<Scalars['String']>>;
  puntoId?: Maybe<Scalars['String']>;
};


export type MutationNuevaVentaArgs = {
  obj: Scalars['JSON'];
  monto?: Maybe<Scalars['Float']>;
  cliente?: Maybe<Scalars['String']>;
  puntoId?: Maybe<Scalars['String']>;
  nombre?: Maybe<Scalars['String']>;
  idPago?: Maybe<Scalars['String']>;
  enviarMensaje?: Maybe<Scalars['Boolean']>;
};


export type MutationNuevaSalidaMercanciaArgs = {
  obj: Scalars['JSON'];
  puntoId: Scalars['String'];
  nombre: Scalars['String'];
};


export type MutationNuevoPedidoArgs = {
  obj: Scalars['JSON'];
  cliente: Scalars['String'];
  prendas: Scalars['Int'];
  urls?: Maybe<Array<Scalars['String']>>;
};


export type MutationEditarPedidoArgs = {
  obj: Scalars['JSON'];
  cliente: Scalars['String'];
  _idPedido: Scalars['String'];
};


export type MutationEliminarPedidoArgs = {
  _idPedido: Scalars['String'];
  cliente?: Maybe<Scalars['String']>;
};


export type MutationAgregarVentaAPedidoArgs = {
  _idPedido: Scalars['String'];
  _idVenta: Scalars['String'];
  cliente: Scalars['String'];
};


export type MutationCancelarPagoArgs = {
  _idCollection: Scalars['String'];
  _idCliente: Scalars['String'];
  cliente: Scalars['String'];
  monto: Scalars['Float'];
  esDescuento?: Maybe<Scalars['Boolean']>;
};


export type MutationCancelarVentaArgs = {
  _idCollection: Scalars['String'];
  _idCliente: Scalars['String'];
  cliente: Scalars['String'];
  monto: Scalars['Float'];
};


export type MutationEditarVentaArgs = {
  _idVenta: Scalars['String'];
  obj: Scalars['JSON'];
  _idCliente: Scalars['String'];
  cliente: Scalars['String'];
  monto: Scalars['Float'];
};


export type MutationUploadEnvioArgs = {
  _idVenta: Scalars['String'];
  path: Scalars['String'];
};

export type MutationRes = {
  __typename?: 'MutationRes';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['String']>;
};


export type OpcionesProcesos = {
  __typename?: 'OpcionesProcesos';
  ref?: Maybe<Scalars['ObjectID']>;
  cantidad?: Maybe<Scalars['Int']>;
};

export type Pago = {
  __typename?: 'Pago';
  _id: Scalars['String'];
  cliente: Scalars['String'];
  nombre: Scalars['String'];
  tipo: Scalars['String'];
  monto: Scalars['Float'];
  fecha?: Maybe<Scalars['String']>;
  cuenta?: Maybe<Scalars['String']>;
  comentarios?: Maybe<Scalars['String']>;
  comprobantes?: Maybe<Array<Scalars['String']>>;
};

export type Pedido = {
  __typename?: 'Pedido';
  _id: Scalars['String'];
  fecha: Scalars['String'];
  cliente: Scalars['String'];
  nombre: Scalars['String'];
  prendas: Scalars['String'];
  monto: Scalars['Float'];
  entrega?: Maybe<Scalars['String']>;
  comentarios?: Maybe<Scalars['String']>;
  articulos: Array<Articulos>;
  archivos?: Maybe<Array<Scalars['String']>>;
  ventas?: Maybe<Array<Scalars['String']>>;
};

export type Persona = {
  __typename?: 'Persona';
  _id: Scalars['String'];
  nombre: Scalars['String'];
  actividades?: Maybe<Array<Scalars['String']>>;
  actividad?: Maybe<Scalars['String']>;
  telefono1?: Maybe<Scalars['String']>;
  telefono2?: Maybe<Scalars['String']>;
  estado?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['String']>;
  direcciones?: Maybe<Array<Direccion>>;
  correo?: Maybe<Scalars['String']>;
};

export type Plaza = {
  __typename?: 'Plaza';
  _id?: Maybe<Scalars['String']>;
  fecha?: Maybe<Scalars['String']>;
  punto?: Maybe<Scalars['String']>;
};

export type Proceso = {
  __typename?: 'Proceso';
  id: Scalars['String'];
  precio?: Maybe<Scalars['Float']>;
  cantidad: Scalars['Int'];
  perdidos: Scalars['Int'];
  restantes: Scalars['Int'];
  proceso?: Maybe<Scalars['String']>;
  manualidad?: Maybe<Scalars['String']>;
};

export type Produccion = {
  __typename?: 'Produccion';
  porMaq: Array<Scalars['JSON']>;
  enMaq: Array<Scalars['JSON']>;
  porMaqL: Array<Scalars['JSON']>;
  enMaqL: Array<Scalars['JSON']>;
  porLav: Array<Scalars['JSON']>;
  enLav: Array<Scalars['JSON']>;
  porPla: Array<Scalars['JSON']>;
  enPla: Array<Scalars['JSON']>;
  porRev: Array<Scalars['JSON']>;
  enRev: Array<Scalars['JSON']>;
  porTerL: Array<Scalars['JSON']>;
  enTerL: Array<Scalars['JSON']>;
  porTer: Array<Scalars['JSON']>;
  enTer: Array<Scalars['JSON']>;
};

export type Query = {
  __typename?: 'Query';
  colaboradores: Array<Persona>;
  colaborador?: Maybe<Persona>;
  telas: Util;
  tallas: Util;
  procesos: Util;
  manualidades: Util;
  colores: Util;
  porProcesos?: Maybe<Array<Scalars['JSON']>>;
  porColores?: Maybe<Array<Scalars['JSON']>>;
  produccion: Produccion;
  cortes: Array<Corte>;
  buscarProcesoId?: Maybe<Scalars['JSON']>;
  corte?: Maybe<Corte>;
  salida?: Maybe<Salida>;
  inventario?: Maybe<Inventario>;
  puntoIdActivo?: Maybe<Scalars['String']>;
  puntosActivos: Scalars['JSON'];
  notificacionesPunto: Scalars['JSON'];
  movimientos?: Maybe<Movimientos>;
  plazas: Array<Plaza>;
  inventarios: Array<Scalars['JSON']>;
  regresosMercancia: Scalars['JSON'];
  usuario?: Maybe<Usuario>;
  isRecaptchaValid: Scalars['Boolean'];
  productos?: Maybe<Util>;
  clientes?: Maybe<Array<Persona>>;
  cliente?: Maybe<Persona>;
  estadoDeCuenta?: Maybe<EstadoDeCuenta>;
  pagos: Array<Pago>;
  pago?: Maybe<Pago>;
  ventas: Array<Venta>;
  pedidos: Array<Pedido>;
  pedido?: Maybe<Pedido>;
  venta?: Maybe<Venta>;
  cuentas?: Maybe<Util>;
  reporteVentasData?: Maybe<Scalars['JSON']>;
  reporteEstadosClientesData?: Maybe<Scalars['JSON']>;
};


export type QueryColaboradorArgs = {
  _id: Scalars['String'];
};


export type QueryTelasArgs = {
  _id: Scalars['String'];
};


export type QueryTallasArgs = {
  _id: Scalars['String'];
};


export type QueryProcesosArgs = {
  _id: Scalars['String'];
};


export type QueryManualidadesArgs = {
  _id: Scalars['String'];
};


export type QueryColoresArgs = {
  _id: Scalars['String'];
};


export type QueryPorProcesosArgs = {
  corte: Scalars['String'];
  tipo: Scalars['String'];
};


export type QueryPorColoresArgs = {
  corte: Scalars['String'];
  tipo: Scalars['String'];
};


export type QueryBuscarProcesoIdArgs = {
  id: Scalars['String'];
};


export type QueryCorteArgs = {
  _id: Scalars['String'];
};


export type QuerySalidaArgs = {
  corte: Scalars['String'];
  movimiento: Scalars['String'];
  id: Scalars['String'];
};


export type QueryInventarioArgs = {
  nombre: Scalars['String'];
};


export type QueryPuntoIdActivoArgs = {
  nombre: Scalars['String'];
};


export type QueryMovimientosArgs = {
  _id: Scalars['String'];
};


export type QueryRegresosMercanciaArgs = {
  _id1: Scalars['String'];
  _id2?: Maybe<Scalars['String']>;
};


export type QueryUsuarioArgs = {
  uid?: Maybe<Scalars['String']>;
};


export type QueryIsRecaptchaValidArgs = {
  token: Scalars['String'];
};


export type QueryProductosArgs = {
  _id: Scalars['String'];
};


export type QueryClienteArgs = {
  _id: Scalars['String'];
};


export type QueryEstadoDeCuentaArgs = {
  _id: Scalars['String'];
};


export type QueryPagoArgs = {
  _id: Scalars['String'];
};


export type QueryPedidoArgs = {
  _id: Scalars['String'];
};


export type QueryVentaArgs = {
  _id: Scalars['String'];
};


export type QueryCuentasArgs = {
  _id: Scalars['String'];
};


export type QueryReporteVentasDataArgs = {
  nombre: Scalars['String'];
};

export type Salida = {
  __typename?: 'Salida';
  folio?: Maybe<Scalars['String']>;
  prenda?: Maybe<Scalars['String']>;
  tela?: Maybe<Scalars['String']>;
  tallas?: Maybe<Scalars['String']>;
  modelo?: Maybe<Scalars['String']>;
  _id: Scalars['String'];
  _idColab: Scalars['ObjectID'];
  nombre: Scalars['String'];
  fecha?: Maybe<Scalars['String']>;
  cantidad?: Maybe<Scalars['Int']>;
  precio?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
  perdidos?: Maybe<Scalars['Int']>;
  procesos?: Maybe<Array<Proceso>>;
  colores?: Maybe<Array<Scalars['JSON']>>;
  comentarios?: Maybe<Scalars['String']>;
  restantes?: Maybe<Scalars['Int']>;
  entradas?: Maybe<Array<Entrada>>;
  revTer?: Maybe<Scalars['Boolean']>;
};

export type Usuario = {
  __typename?: 'Usuario';
  _id: Scalars['String'];
  nombre: Scalars['String'];
  correo: Scalars['String'];
  roles: Array<Scalars['JSON']>;
  infoPunto?: Maybe<Scalars['String']>;
  sinAlmacen?: Maybe<Scalars['Boolean']>;
  puntoId?: Maybe<Scalars['String']>;
};

export type Util = {
  __typename?: 'Util';
  values?: Maybe<Array<Scalars['String']>>;
  objects?: Maybe<Array<Scalars['JSON']>>;
};

export type Venta = {
  __typename?: 'Venta';
  _id: Scalars['String'];
  fecha?: Maybe<Scalars['String']>;
  cliente: Scalars['String'];
  tipo?: Maybe<Scalars['String']>;
  ajuste?: Maybe<Scalars['Float']>;
  direccion?: Maybe<Scalars['String']>;
  nombre?: Maybe<Scalars['String']>;
  monto: Scalars['Float'];
  estatus?: Maybe<Scalars['String']>;
  comentarios?: Maybe<Scalars['String']>;
  articulos?: Maybe<Array<ArticulosVenta>>;
  comprobante?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Articulos: ResolverTypeWrapper<Articulos>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ArticulosVenta: ResolverTypeWrapper<ArticulosVenta>;
  CacheControlScope: CacheControlScope;
  Corte: ResolverTypeWrapper<Corte>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Direccion: ResolverTypeWrapper<Direccion>;
  Entrada: ResolverTypeWrapper<Entrada>;
  EstadoDeCuenta: ResolverTypeWrapper<EstadoDeCuenta>;
  Gasto: ResolverTypeWrapper<Gasto>;
  Inventario: ResolverTypeWrapper<Inventario>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Movimiento: ResolverTypeWrapper<Movimiento>;
  MovimientoDeCuenta: ResolverTypeWrapper<MovimientoDeCuenta>;
  Movimientos: ResolverTypeWrapper<Movimientos>;
  Mutation: ResolverTypeWrapper<{}>;
  MutationRes: ResolverTypeWrapper<MutationRes>;
  ObjectID: ResolverTypeWrapper<Scalars['ObjectID']>;
  OpcionesProcesos: ResolverTypeWrapper<OpcionesProcesos>;
  Pago: ResolverTypeWrapper<Pago>;
  Pedido: ResolverTypeWrapper<Pedido>;
  Persona: ResolverTypeWrapper<Persona>;
  Plaza: ResolverTypeWrapper<Plaza>;
  Proceso: ResolverTypeWrapper<Proceso>;
  Produccion: ResolverTypeWrapper<Produccion>;
  Query: ResolverTypeWrapper<{}>;
  Salida: ResolverTypeWrapper<Salida>;
  Usuario: ResolverTypeWrapper<Usuario>;
  Util: ResolverTypeWrapper<Util>;
  Venta: ResolverTypeWrapper<Venta>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Articulos: Articulos;
  String: Scalars['String'];
  Int: Scalars['Int'];
  Float: Scalars['Float'];
  ArticulosVenta: ArticulosVenta;
  Corte: Corte;
  Boolean: Scalars['Boolean'];
  Direccion: Direccion;
  Entrada: Entrada;
  EstadoDeCuenta: EstadoDeCuenta;
  Gasto: Gasto;
  Inventario: Inventario;
  JSON: Scalars['JSON'];
  Movimiento: Movimiento;
  MovimientoDeCuenta: MovimientoDeCuenta;
  Movimientos: Movimientos;
  Mutation: {};
  MutationRes: MutationRes;
  ObjectID: Scalars['ObjectID'];
  OpcionesProcesos: OpcionesProcesos;
  Pago: Pago;
  Pedido: Pedido;
  Persona: Persona;
  Plaza: Plaza;
  Proceso: Proceso;
  Produccion: Produccion;
  Query: {};
  Salida: Salida;
  Usuario: Usuario;
  Util: Util;
  Venta: Venta;
};

export type CacheControlDirectiveArgs = {   maxAge?: Maybe<Scalars['Int']>;
  scope?: Maybe<CacheControlScope>; };

export type CacheControlDirectiveResolver<Result, Parent, ContextType = any, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ArticulosResolvers<ContextType = any, ParentType extends ResolversParentTypes['Articulos'] = ResolversParentTypes['Articulos']> = {
  codigo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  articulo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cantidad?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  precio?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticulosVentaResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArticulosVenta'] = ResolversParentTypes['ArticulosVenta']> = {
  articulo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cantidad?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  precio?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CorteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Corte'] = ResolversParentTypes['Corte']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  folio?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fecha?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prenda?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tela?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tallas?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  modelo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  colores?: Resolver<Maybe<Array<ResolversTypes['JSON']>>, ParentType, ContextType>;
  comentarios?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  porMaq?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  porMaqArr?: Resolver<Maybe<Array<ResolversTypes['JSON']>>, ParentType, ContextType>;
  porLav?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  porPla?: Resolver<Maybe<Array<ResolversTypes['JSON']>>, ParentType, ContextType>;
  porRev?: Resolver<Maybe<Array<ResolversTypes['JSON']>>, ParentType, ContextType>;
  porTer?: Resolver<Maybe<Array<ResolversTypes['JSON']>>, ParentType, ContextType>;
  estatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  completo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  SMaq?: Resolver<Maybe<Array<ResolversTypes['Salida']>>, ParentType, ContextType>;
  SLav?: Resolver<Maybe<Array<ResolversTypes['Salida']>>, ParentType, ContextType>;
  SPla?: Resolver<Maybe<Array<ResolversTypes['Salida']>>, ParentType, ContextType>;
  SRev?: Resolver<Maybe<Array<ResolversTypes['Salida']>>, ParentType, ContextType>;
  STer?: Resolver<Maybe<Array<ResolversTypes['Salida']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DireccionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Direccion'] = ResolversParentTypes['Direccion']> = {
  direccion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  estado?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntradaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entrada'] = ResolversParentTypes['Entrada']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectID']>, ParentType, ContextType>;
  fecha?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cantidad?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  perdidos?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ids?: Resolver<Maybe<Array<ResolversTypes['JSON']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EstadoDeCuentaResolvers<ContextType = any, ParentType extends ResolversParentTypes['EstadoDeCuenta'] = ResolversParentTypes['EstadoDeCuenta']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  estado?: Resolver<Array<ResolversTypes['MovimientoDeCuenta']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GastoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Gasto'] = ResolversParentTypes['Gasto']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fecha?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  descripcion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  monto?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InventarioResolvers<ContextType = any, ParentType extends ResolversParentTypes['Inventario'] = ResolversParentTypes['Inventario']> = {
  fecha?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inventario?: Resolver<Array<ResolversTypes['Articulos']>, ParentType, ContextType>;
  oid?: Resolver<Maybe<ResolversTypes['ObjectID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MovimientoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Movimiento'] = ResolversParentTypes['Movimiento']> = {
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fecha?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tipo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pago?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  monto?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  prendas?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  articulos?: Resolver<Maybe<Array<ResolversTypes['Articulos']>>, ParentType, ContextType>;
  comentarios?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MovimientoDeCuentaResolvers<ContextType = any, ParentType extends ResolversParentTypes['MovimientoDeCuenta'] = ResolversParentTypes['MovimientoDeCuenta']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fecha?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  descripcion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  monto?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MovimientosResolvers<ContextType = any, ParentType extends ResolversParentTypes['Movimientos'] = ResolversParentTypes['Movimientos']> = {
  fecha?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  punto?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  movimientos?: Resolver<Array<ResolversTypes['Movimiento']>, ParentType, ContextType>;
  gastos?: Resolver<Array<ResolversTypes['Gasto']>, ParentType, ContextType>;
  discrepancias?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  nuevoColaborador?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevoColaboradorArgs, 'obj'>>;
  editarColaborador?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEditarColaboradorArgs, '_idColaborador' | 'telefonos' | 'correo'>>;
  nuevoCorte?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevoCorteArgs, 'obj'>>;
  nuevaSalida?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevaSalidaArgs, 'obj' | 'corte' | 'tipo' | 'folio' | 'prenda'>>;
  nuevaSalidaProcesos?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevaSalidaProcesosArgs, 'obj' | 'corte' | 'tipo' | 'folio' | 'prenda'>>;
  nuevaEntrada?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevaEntradaArgs, 'obj' | 'corte' | 'id' | 'folio' | 'nombre' | 'prenda'>>;
  nuevaEntradaProcesos?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevaEntradaProcesosArgs, 'obj' | 'corte' | 'id' | 'tipo' | 'folio' | 'nombre' | 'prenda' | 'procesosEntrada'>>;
  eliminarCorte?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEliminarCorteArgs, 'corte' | 'total' | 'prenda' | 'folio'>>;
  editarPrecioSalida?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEditarPrecioSalidaArgs, 'corte' | 'movimiento' | 'id' | 'precio'>>;
  eliminarSalida?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEliminarSalidaArgs, 'corte' | 'movimiento' | 'id' | 'nombre' | 'prenda' | 'folio'>>;
  eliminarSalidaProcesos?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEliminarSalidaProcesosArgs, 'corte' | 'movimiento' | 'id' | 'nombre' | 'prenda' | 'folio'>>;
  eliminarEntrada?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEliminarEntradaArgs, 'corte' | 'id' | 'nombre' | 'prenda' | 'folio'>>;
  eliminarEntradaProcesos?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEliminarEntradaProcesosArgs, 'corte' | 'movimiento' | 'id' | 'nombre' | 'prenda' | 'folio'>>;
  editarPreciosProcesos?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEditarPreciosProcesosArgs, 'corte' | 'id' | 'movimiento' | 'preciosArr'>>;
  editarProcesos?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEditarProcesosArgs, 'corte' | 'id' | 'procesosArr'>>;
  enviarFotoProduccion?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEnviarFotoProduccionArgs, 'url'>>;
  modificarPuntosActivos?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationModificarPuntosActivosArgs, 'nombre' | 'propiedad'>>;
  marcarLeidos?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationMarcarLeidosArgs, 'nombre'>>;
  nuevoIntercambio?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevoIntercambioArgs, 'obj' | 'nombreSalida' | 'nombreEntrada'>>;
  nuevoRegreso?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevoRegresoArgs, 'obj' | 'puntoId' | 'nombre'>>;
  cancelarMovimiento?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationCancelarMovimientoArgs, 'articulos' | 'puntoId' | 'nombre' | 'idMovimiento' | 'message'>>;
  nuevoGasto?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevoGastoArgs, 'obj' | 'puntoId'>>;
  registrarDiscrepancias?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationRegistrarDiscrepanciasArgs, 'articulos' | 'puntoId' | 'tipo'>>;
  deleteObjectUtils?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationDeleteObjectUtilsArgs, '_id' | 'object' | 'message'>>;
  deleteValueUtils?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationDeleteValueUtilsArgs, '_id' | 'value' | 'message'>>;
  addValueUtils?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationAddValueUtilsArgs, '_id' | 'value' | 'message'>>;
  addObjectUtils?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationAddObjectUtilsArgs, '_id' | 'object' | 'message'>>;
  addDireccion?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationAddDireccionArgs, 'collection' | 'obj' | '_id'>>;
  editarProductos?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEditarProductosArgs, '_id' | 'codigo' | 'object' | 'message'>>;
  enviarReporteUrl?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEnviarReporteUrlArgs, 'nombre' | 'url'>>;
  nuevoCliente?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevoClienteArgs, 'obj'>>;
  editarCliente?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEditarClienteArgs, '_idCliente' | 'telefonos' | 'correo'>>;
  nuevoPago?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevoPagoArgs, 'obj' | 'cliente'>>;
  nuevaVenta?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevaVentaArgs, 'obj'>>;
  nuevaSalidaMercancia?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevaSalidaMercanciaArgs, 'obj' | 'puntoId' | 'nombre'>>;
  nuevoPedido?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationNuevoPedidoArgs, 'obj' | 'cliente' | 'prendas'>>;
  editarPedido?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEditarPedidoArgs, 'obj' | 'cliente' | '_idPedido'>>;
  eliminarPedido?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEliminarPedidoArgs, '_idPedido'>>;
  agregarVentaAPedido?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationAgregarVentaAPedidoArgs, '_idPedido' | '_idVenta' | 'cliente'>>;
  cancelarPago?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationCancelarPagoArgs, '_idCollection' | '_idCliente' | 'cliente' | 'monto'>>;
  cancelarVenta?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationCancelarVentaArgs, '_idCollection' | '_idCliente' | 'cliente' | 'monto'>>;
  editarVenta?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationEditarVentaArgs, '_idVenta' | 'obj' | '_idCliente' | 'cliente' | 'monto'>>;
  uploadEnvio?: Resolver<ResolversTypes['MutationRes'], ParentType, ContextType, RequireFields<MutationUploadEnvioArgs, '_idVenta' | 'path'>>;
};

export type MutationResResolvers<ContextType = any, ParentType extends ResolversParentTypes['MutationRes'] = ResolversParentTypes['MutationRes']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectID'], any> {
  name: 'ObjectID';
}

export type OpcionesProcesosResolvers<ContextType = any, ParentType extends ResolversParentTypes['OpcionesProcesos'] = ResolversParentTypes['OpcionesProcesos']> = {
  ref?: Resolver<Maybe<ResolversTypes['ObjectID']>, ParentType, ContextType>;
  cantidad?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PagoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pago'] = ResolversParentTypes['Pago']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cliente?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nombre?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tipo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  monto?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  fecha?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cuenta?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comentarios?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comprobantes?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PedidoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pedido'] = ResolversParentTypes['Pedido']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fecha?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cliente?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nombre?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prendas?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  monto?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  entrega?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comentarios?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  articulos?: Resolver<Array<ResolversTypes['Articulos']>, ParentType, ContextType>;
  archivos?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  ventas?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Persona'] = ResolversParentTypes['Persona']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nombre?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  actividades?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  actividad?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  telefono1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  telefono2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  estado?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  balance?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  direcciones?: Resolver<Maybe<Array<ResolversTypes['Direccion']>>, ParentType, ContextType>;
  correo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlazaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Plaza'] = ResolversParentTypes['Plaza']> = {
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fecha?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  punto?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProcesoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Proceso'] = ResolversParentTypes['Proceso']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  precio?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  cantidad?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  perdidos?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  restantes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  proceso?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  manualidad?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProduccionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Produccion'] = ResolversParentTypes['Produccion']> = {
  porMaq?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  enMaq?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  porMaqL?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  enMaqL?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  porLav?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  enLav?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  porPla?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  enPla?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  porRev?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  enRev?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  porTerL?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  enTerL?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  porTer?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  enTer?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  colaboradores?: Resolver<Array<ResolversTypes['Persona']>, ParentType, ContextType>;
  colaborador?: Resolver<Maybe<ResolversTypes['Persona']>, ParentType, ContextType, RequireFields<QueryColaboradorArgs, '_id'>>;
  telas?: Resolver<ResolversTypes['Util'], ParentType, ContextType, RequireFields<QueryTelasArgs, '_id'>>;
  tallas?: Resolver<ResolversTypes['Util'], ParentType, ContextType, RequireFields<QueryTallasArgs, '_id'>>;
  procesos?: Resolver<ResolversTypes['Util'], ParentType, ContextType, RequireFields<QueryProcesosArgs, '_id'>>;
  manualidades?: Resolver<ResolversTypes['Util'], ParentType, ContextType, RequireFields<QueryManualidadesArgs, '_id'>>;
  colores?: Resolver<ResolversTypes['Util'], ParentType, ContextType, RequireFields<QueryColoresArgs, '_id'>>;
  porProcesos?: Resolver<Maybe<Array<ResolversTypes['JSON']>>, ParentType, ContextType, RequireFields<QueryPorProcesosArgs, 'corte' | 'tipo'>>;
  porColores?: Resolver<Maybe<Array<ResolversTypes['JSON']>>, ParentType, ContextType, RequireFields<QueryPorColoresArgs, 'corte' | 'tipo'>>;
  produccion?: Resolver<ResolversTypes['Produccion'], ParentType, ContextType>;
  cortes?: Resolver<Array<ResolversTypes['Corte']>, ParentType, ContextType>;
  buscarProcesoId?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryBuscarProcesoIdArgs, 'id'>>;
  corte?: Resolver<Maybe<ResolversTypes['Corte']>, ParentType, ContextType, RequireFields<QueryCorteArgs, '_id'>>;
  salida?: Resolver<Maybe<ResolversTypes['Salida']>, ParentType, ContextType, RequireFields<QuerySalidaArgs, 'corte' | 'movimiento' | 'id'>>;
  inventario?: Resolver<Maybe<ResolversTypes['Inventario']>, ParentType, ContextType, RequireFields<QueryInventarioArgs, 'nombre'>>;
  puntoIdActivo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryPuntoIdActivoArgs, 'nombre'>>;
  puntosActivos?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  notificacionesPunto?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  movimientos?: Resolver<Maybe<ResolversTypes['Movimientos']>, ParentType, ContextType, RequireFields<QueryMovimientosArgs, '_id'>>;
  plazas?: Resolver<Array<ResolversTypes['Plaza']>, ParentType, ContextType>;
  inventarios?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  regresosMercancia?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<QueryRegresosMercanciaArgs, '_id1'>>;
  usuario?: Resolver<Maybe<ResolversTypes['Usuario']>, ParentType, ContextType, RequireFields<QueryUsuarioArgs, never>>;
  isRecaptchaValid?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryIsRecaptchaValidArgs, 'token'>>;
  productos?: Resolver<Maybe<ResolversTypes['Util']>, ParentType, ContextType, RequireFields<QueryProductosArgs, '_id'>>;
  clientes?: Resolver<Maybe<Array<ResolversTypes['Persona']>>, ParentType, ContextType>;
  cliente?: Resolver<Maybe<ResolversTypes['Persona']>, ParentType, ContextType, RequireFields<QueryClienteArgs, '_id'>>;
  estadoDeCuenta?: Resolver<Maybe<ResolversTypes['EstadoDeCuenta']>, ParentType, ContextType, RequireFields<QueryEstadoDeCuentaArgs, '_id'>>;
  pagos?: Resolver<Array<ResolversTypes['Pago']>, ParentType, ContextType>;
  pago?: Resolver<Maybe<ResolversTypes['Pago']>, ParentType, ContextType, RequireFields<QueryPagoArgs, '_id'>>;
  ventas?: Resolver<Array<ResolversTypes['Venta']>, ParentType, ContextType>;
  pedidos?: Resolver<Array<ResolversTypes['Pedido']>, ParentType, ContextType>;
  pedido?: Resolver<Maybe<ResolversTypes['Pedido']>, ParentType, ContextType, RequireFields<QueryPedidoArgs, '_id'>>;
  venta?: Resolver<Maybe<ResolversTypes['Venta']>, ParentType, ContextType, RequireFields<QueryVentaArgs, '_id'>>;
  cuentas?: Resolver<Maybe<ResolversTypes['Util']>, ParentType, ContextType, RequireFields<QueryCuentasArgs, '_id'>>;
  reporteVentasData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryReporteVentasDataArgs, 'nombre'>>;
  reporteEstadosClientesData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
};

export type SalidaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Salida'] = ResolversParentTypes['Salida']> = {
  folio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prenda?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tela?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tallas?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modelo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  _idColab?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  nombre?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fecha?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cantidad?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  precio?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  perdidos?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  procesos?: Resolver<Maybe<Array<ResolversTypes['Proceso']>>, ParentType, ContextType>;
  colores?: Resolver<Maybe<Array<ResolversTypes['JSON']>>, ParentType, ContextType>;
  comentarios?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  restantes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  entradas?: Resolver<Maybe<Array<ResolversTypes['Entrada']>>, ParentType, ContextType>;
  revTer?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsuarioResolvers<ContextType = any, ParentType extends ResolversParentTypes['Usuario'] = ResolversParentTypes['Usuario']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nombre?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  correo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  infoPunto?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sinAlmacen?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  puntoId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UtilResolvers<ContextType = any, ParentType extends ResolversParentTypes['Util'] = ResolversParentTypes['Util']> = {
  values?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  objects?: Resolver<Maybe<Array<ResolversTypes['JSON']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VentaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Venta'] = ResolversParentTypes['Venta']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fecha?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cliente?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tipo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ajuste?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  direccion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nombre?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  monto?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  estatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comentarios?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  articulos?: Resolver<Maybe<Array<ResolversTypes['ArticulosVenta']>>, ParentType, ContextType>;
  comprobante?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Articulos?: ArticulosResolvers<ContextType>;
  ArticulosVenta?: ArticulosVentaResolvers<ContextType>;
  Corte?: CorteResolvers<ContextType>;
  Direccion?: DireccionResolvers<ContextType>;
  Entrada?: EntradaResolvers<ContextType>;
  EstadoDeCuenta?: EstadoDeCuentaResolvers<ContextType>;
  Gasto?: GastoResolvers<ContextType>;
  Inventario?: InventarioResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Movimiento?: MovimientoResolvers<ContextType>;
  MovimientoDeCuenta?: MovimientoDeCuentaResolvers<ContextType>;
  Movimientos?: MovimientosResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationRes?: MutationResResolvers<ContextType>;
  ObjectID?: GraphQLScalarType;
  OpcionesProcesos?: OpcionesProcesosResolvers<ContextType>;
  Pago?: PagoResolvers<ContextType>;
  Pedido?: PedidoResolvers<ContextType>;
  Persona?: PersonaResolvers<ContextType>;
  Plaza?: PlazaResolvers<ContextType>;
  Proceso?: ProcesoResolvers<ContextType>;
  Produccion?: ProduccionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Salida?: SalidaResolvers<ContextType>;
  Usuario?: UsuarioResolvers<ContextType>;
  Util?: UtilResolvers<ContextType>;
  Venta?: VentaResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
};


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;