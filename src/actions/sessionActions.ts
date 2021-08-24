import { Dispatch } from 'react';
import { Role } from '../types/types';

interface LoginArgs {
  nombre: string;
  roles: Role[];
  uid: string;
}
export interface SessionAction {
  type: 'SESSION_LOGOUT' | 'SESSION_LOGIN';
  loginArgs?: LoginArgs;
}

export const login = (loginArgs: LoginArgs) => (
  dispatch: Dispatch<SessionAction>
): void =>
  dispatch({
    type: 'SESSION_LOGIN',
    loginArgs,
  });
export const logout = () => (dispatch: Dispatch<SessionAction>): void =>
  dispatch({
    type: 'SESSION_LOGOUT',
  });
