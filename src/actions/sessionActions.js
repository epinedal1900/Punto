export const SESSION_LOGIN = 'SESSION_LOGIN';
export const SESSION_LOGOUT = 'SESSION_LOGOUT';
export const MODIFICAR_TICKETS = 'MODIFICAR_TICKETS';
export const MODIFICAR_IMPRESORA = 'MODIFICAR_IMPRESORA';
export const MODIFICAR_ULTIMO_TICKET = 'MODIFICAR_ULTIMO_TICKET';

export const login = (args) => (dispatch) =>
  dispatch({
    type: SESSION_LOGIN,
    payload: args,
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
