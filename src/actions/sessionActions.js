export const SESSION_LOGIN = 'SESSION_LOGIN';
export const SESSION_LOGOUT = 'SESSION_LOGOUT';
export const MODIFICAR_TICKETS = 'MODIFICAR_TICKETS';
export const MODIFICAR_IMPRESORA = 'MODIFICAR_IMPRESORA';
export const MODIFICAR_ULTIMO_TICKET = 'MODIFICAR_ULTIMO_TICKET';
export const DESACTIVAR_PUNTO = 'DESACTIVAR_PUNTO';
export const GUARDAR_INVENTARIO = 'GUARDAR_INVENTARIO';
export const MODIFICAR_ONLINE = 'MODIFICAR_ONLINE';
export const ASIGNAR_PUNTO = 'ASIGNAR_PUNTO';

export const login = (args) => (dispatch) =>
  dispatch({
    type: SESSION_LOGIN,
    payload: args,
  });
export const desactivarPunto = () => (dispatch) =>
  dispatch({
    type: DESACTIVAR_PUNTO,
  });
export const logout = () => (dispatch) =>
  dispatch({
    type: SESSION_LOGOUT,
  });
export const modificarTickets = (args) => (dispatch) =>
  dispatch({
    type: MODIFICAR_TICKETS,
    payload: args,
  });
export const asignarPunto = (args) => (dispatch) =>
  dispatch({
    type: ASIGNAR_PUNTO,
    payload: args,
  });
export const modificarOnline = (args) => (dispatch) =>
  dispatch({
    type: MODIFICAR_ONLINE,
    payload: args,
  });
export const guardarInventario = (args) => (dispatch) =>
  dispatch({
    type: GUARDAR_INVENTARIO,
    payload: args,
  });
export const modificarUltimoTicket = (args) => (dispatch) =>
  dispatch({
    type: MODIFICAR_ULTIMO_TICKET,
    payload: args,
  });
export const modificarImpresora = (args) => (dispatch) =>
  dispatch({
    type: MODIFICAR_IMPRESORA,
    payload: args,
  });
