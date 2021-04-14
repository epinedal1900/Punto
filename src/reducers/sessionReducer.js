import * as actionTypes from '../actions';

const initialState = {
  loggedIn: localStorage.getItem('loggedIn') || 'false',
  nombre: localStorage.getItem('nombre'),
  roles: localStorage.getItem('roles'),
  articulos: null,
  cliente: null,
  idPedido: null,
  eliminarPedido: null,
  pedidoConVentas: null,
  tickets: [[]],
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
      };
    }
    case actionTypes.SESSION_LOGOUT: {
      return {
        ...state,
        loggedIn: 'false',
        nombre: null,
        roles: null,
      };
    }
    case actionTypes.CREAR_VENTA: {
      return {
        ...state,
        articulos: action.payload.articulos,
        cliente: action.payload.cliente,
        idPedido: action.payload.idPedido,
        pedidoConVentas: action.payload.pedidoConVentas,
        eliminarPedido: action.payload.eliminarPedido,
      };
    }
    case actionTypes.LIMPIAR_VENTA: {
      return {
        ...state,
        articulos: null,
        cliente: null,
        idPedido: null,
        eliminarPedido: null,
        pedidoConVentas: null,
      };
    }
    case actionTypes.MODIFICAR_TICKETS: {
      return {
        ...state,
        tickets: action.payload.tickets,
      };
    }
    case actionTypes.SET_ELIMINAR_PEDIDO: {
      return {
        ...state,
        eliminarPedido: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default sessionReducer;
