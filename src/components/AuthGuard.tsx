/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import history from '../utils/history'
import { useHistory } from 'react-router-dom';
import { RootState } from '../types/store';
import { AppRole } from '../types/types';

import useRouter from '../utils/useRouter';

interface AuthGuardProps {
  roles: AppRole[];
  children: JSX.Element | JSX.Element[];
  denyReadOnly?: boolean;
}
const AuthGuard = (props: AuthGuardProps): JSX.Element => {
  const { roles = [], children, denyReadOnly = false } = props;
  const session = useSelector((state: RootState) => state.session);
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();
  const router = useRouter();

  useEffect(() => {
    if (!session.loggedIn) {
      history.push('/ingreso');
    } else if (
      !session.roles?.some((sessionRole) => {
        return roles.includes(sessionRole.role);
      }) ||
      (denyReadOnly &&
        session.roles?.some((sessionRole) => {
          return roles.includes(sessionRole.role) && sessionRole.readOnly;
        }))
    ) {
      history.push('/error/404');
    } else {
      setLoggedIn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return <>{loggedIn && children}</>;
};

export default AuthGuard;
