import { PlazaAction } from '../actions';
import { PlazaState } from '../types/types';

const initialState: PlazaState = {
  idInventario: localStorage.getItem('idInventario'),
  _idPunto: localStorage.getItem('_idPunto'),
  _idPuntoPrincipal: localStorage.getItem('_idPuntoPrincipal'),
  infoPunto: localStorage.getItem('infoPunto'),
  ultimoTicket: null,
  online: JSON.parse(localStorage.getItem('online') || 'false'),
  impresora: localStorage.getItem('impresora'),
  ancho: localStorage.getItem('ancho'),
  sinAlmacen: JSON.parse(localStorage.getItem('sinAlmacen') || 'false'),
};

const sessionReducer = (
  state = initialState,
  action: PlazaAction
): PlazaState => {
  switch (action.type) {
    case 'DESACTIVAR_PUNTO': {
      localStorage.removeItem('_idPunto');
      localStorage.removeItem('_idPuntoPrincipal');
      return {
        ...state,
        _idPunto: null,
        _idPuntoPrincipal: null,
      };
    }
    case 'ASIGNAR_PUNTO': {
      if (action.asignarPuntoArgs) {
        localStorage.setItem(
          'idInventario',
          action.asignarPuntoArgs.idInventario
        );
        localStorage.setItem('_idPunto', action.asignarPuntoArgs._idPunto);
        localStorage.setItem(
          '_idPuntoPrincipal',
          action.asignarPuntoArgs._idPuntoPrincipal
        );
        localStorage.setItem(
          'sinAlmacen',
          JSON.stringify(action.asignarPuntoArgs.sinAlmacen)
        );
        localStorage.setItem('infoPunto', action.asignarPuntoArgs.infoPunto);
      }
      return {
        ...state,
        idInventario: action.asignarPuntoArgs?.idInventario || null,
        _idPunto: action.asignarPuntoArgs?._idPunto || null,
        _idPuntoPrincipal: action.asignarPuntoArgs?._idPuntoPrincipal || null,
        sinAlmacen: action.asignarPuntoArgs?.sinAlmacen || false,
        infoPunto: action.asignarPuntoArgs?.infoPunto || null,
      };
    }
    case 'MODIFICAR_ONLINE': {
      localStorage.setItem(
        'online',
        JSON.stringify(Boolean(action.modificarOnline))
      );
      return {
        ...state,
        online: Boolean(action.modificarOnline),
      };
    }
    case 'MODIFICAR_ULTIMO_TICKET': {
      return {
        ...state,
        ultimoTicket: action.ultimoTicket || null,
      };
    }
    case 'MODIFICAR_IMPRESORA': {
      if (action.impresora) {
        localStorage.setItem('impresora', action.impresora.impresora);
        localStorage.setItem('ancho', action.impresora.ancho);
      }
      return {
        ...state,
        impresora: action.impresora?.impresora || null,
        ancho: action.impresora?.ancho || null,
      };
    }
    default: {
      return state;
    }
  }
};

export default sessionReducer;
