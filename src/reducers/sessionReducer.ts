import { SessionAction } from '../actions';
import { SessionState } from '../types/types';

const initialState: SessionState = {
  loggedIn: Boolean(localStorage.getItem('loggedIn')),
  nombre: localStorage.getItem('nombre'),
  roles: JSON.parse(localStorage.getItem('roles') || 'null'),
  uid: localStorage.getItem('uid'),
};

const sessionReducer = (
  state = initialState,
  action: SessionAction
): SessionState => {
  switch (action.type) {
    case 'SESSION_LOGIN': {
      if (action.loginArgs) {
        localStorage.setItem('nombre', action.loginArgs.nombre);
        localStorage.setItem('roles', JSON.stringify(action.loginArgs.roles));
        localStorage.setItem('uid', action.loginArgs.uid);
        localStorage.setItem('loggedIn', 'true');
      }
      return {
        ...state,
        loggedIn: true,
        nombre: action.loginArgs?.nombre || state.nombre,
        roles: action.loginArgs?.roles || state.roles,
        uid: action.loginArgs?.uid || state.uid,
      };
    }
    case 'SESSION_LOGOUT': {
      localStorage.setItem('loggedIn', 'false');
      localStorage.removeItem('_idPunto');
      localStorage.removeItem('_idPuntoPrincipal');
      localStorage.removeItem('idInventario');
      localStorage.removeItem('sinAlmacen');
      localStorage.removeItem('infoPunto');
      localStorage.removeItem('nombre');
      localStorage.removeItem('roles');
      localStorage.removeItem('uid');
      return {
        ...state,
        loggedIn: false,
        nombre: null,
        roles: null,
        uid: null,
      };
    }
    default: {
      return state;
    }
  }
};

export default sessionReducer;
