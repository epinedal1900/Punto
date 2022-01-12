import {
  ArticulosValues,
  IntercambioValues,
  PrincipalValues,
  Ticket,
} from '../types/types';

export const ArticulosInitialValues: ArticulosValues = {
  escaneos: [],
  prendasSueltas: [],
  precios: [],
};
export const IntercambiosInitialValues: IntercambioValues = {
  ...ArticulosInitialValues,
  tipoDeImpresion: 'imprimir',
  plazaReceptora: '',
};

export const TicketsInitialValues: Ticket = {
  ...ArticulosInitialValues,
  esMenudeo: false,
  articulo: '',
  cantidad: 0,
  tipoDePago: 'efectivo',
  cliente: '',
  tipoDeImpresion: 'imprimir',
  comentarios: '',
  cantidadPagada: 0,
  _id: encodeURI('ticket 1'),
};

export const PrincipalInitialValues: PrincipalValues = {
  ...TicketsInitialValues,
  intercambioValues: IntercambiosInitialValues,
};
