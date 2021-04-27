import * as actionTypes from '../actions';

const initialState = {
  loggedIn: localStorage.getItem('loggedIn') || 'false',
  nombre: localStorage.getItem('nombre'),
  roles: localStorage.getItem('roles'),
  puntoIdActivo: localStorage.getItem('puntoIdActivo'),
  infoPunto: localStorage.getItem('infoPunto'),
  tickets: [{ cliente: '', articulos: [] }],
  ultimoTicket: {},
  impresora: localStorage.getItem('impresora'),
  ancho: localStorage.getItem('ancho'),
};
// roles and name from db

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SESSION_LOGIN: {
      return {
        ...state,
        loggedIn: 'true',
        nombre: action.payload.nombre,
        roles: action.payload.roles,
        puntoIdActivo: action.payload.puntoIdActivo,
        infoPunto: action.payload.infoPunto,
      };
    }
    case actionTypes.SESSION_LOGOUT: {
      return {
        ...state,
        loggedIn: 'false',
        nombre: null,
        roles: null,
        puntoIdActivo: null,
        infoPunto: null,
      };
    }
    case actionTypes.MODIFICAR_TICKETS: {
      return {
        ...state,
        tickets: action.payload.tickets,
      };
    }
    case actionTypes.MODIFICAR_ULTIMO_TICKET: {
      return {
        ...state,
        ultimoTicket: action.payload.ultimoTicket,
      };
    }
    case actionTypes.MODIFICAR_IMPRESORA: {
      return {
        ...state,
        impresora: action.payload.impresora,
        ancho: action.payload.ancho,
      };
    }
    default: {
      return state;
    }
  }
};

export default sessionReducer;
