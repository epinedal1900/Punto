export const SESSION_LOGIN = 'SESSION_LOGIN';
export const SESSION_LOGOUT = 'SESSION_LOGOUT';
export const CREAR_VENTA = 'CREAR_VENTA';
export const LIMPIAR_VENTA = 'LIMPIAR_VENTA';
export const SET_ELIMINAR_PEDIDO = 'SET_ELIMINAR_PEDIDO';

export const login = (args) => (dispatch) =>
  dispatch({
    type: SESSION_LOGIN,
    payload: args,
  });

export const logout = () => (dispatch) =>
  dispatch({
    type: SESSION_LOGOUT,
  });
export const crearVenta = (args) => (dispatch) =>
  dispatch({
    type: CREAR_VENTA,
    payload: args,
  });
export const setEliminarPedido = (args) => (dispatch) =>
  dispatch({
    type: SET_ELIMINAR_PEDIDO,
    payload: args,
  });
export const limpiarVenta = () => (dispatch) =>
  dispatch({
    type: LIMPIAR_VENTA,
  });
