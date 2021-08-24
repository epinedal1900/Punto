import { Dispatch } from 'react';
import {
  ImpresionDeTicketsArgs,
  ImpresoraValues,
  Ticket,
} from '../types/types';

interface AsignarPuntoArgs {
  idInventario: string;
  _idPunto: string;
  _idPuntoPrincipal: string;
  sinAlmacen: boolean;
  infoPunto: string;
}
export interface PlazaAction {
  type:
    | 'MODIFICAR_IMPRESORA'
    | 'MODIFICAR_ULTIMO_TICKET'
    | 'DESACTIVAR_PUNTO'
    | 'GUARDAR_INVENTARIO'
    | 'MODIFICAR_ONLINE'
    | 'ASIGNAR_PUNTO';
  modificarTicketsArgs?: Ticket[];
  asignarPuntoArgs?: AsignarPuntoArgs;
  modificarOnline?: boolean;
  ultimoTicket?: Required<ImpresionDeTicketsArgs>;
  impresora?: ImpresoraValues;
}

export const desactivarPunto = () => (dispatch: Dispatch<PlazaAction>): void =>
  dispatch({
    type: 'DESACTIVAR_PUNTO',
  });

export const asignarPunto = (args: AsignarPuntoArgs) => (
  dispatch: Dispatch<PlazaAction>
): void =>
  dispatch({
    type: 'ASIGNAR_PUNTO',
    asignarPuntoArgs: args,
  });

export const modificarOnline = (online: boolean) => (
  dispatch: Dispatch<PlazaAction>
): void =>
  dispatch({
    type: 'MODIFICAR_ONLINE',
    modificarOnline: online,
  });

export const modificarUltimoTicket = (
  ultimoTicket: Required<ImpresionDeTicketsArgs>
) => (dispatch: Dispatch<PlazaAction>): void =>
  dispatch({
    type: 'MODIFICAR_ULTIMO_TICKET',
    ultimoTicket,
  });

export const modificarImpresora = (impresora: ImpresoraValues) => (
  dispatch: Dispatch<PlazaAction>
): void =>
  dispatch({
    type: 'MODIFICAR_IMPRESORA',
    impresora,
  });
