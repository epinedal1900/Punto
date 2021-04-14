/* eslint-disable no-alert */
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import history from '../utils/history'
import { useHistory } from 'react-router-dom';

import useRouter from '../utils/useRouter';

const AuthGuard = (props) => {
  const { roles, children, denyReadOnly } = props;
  const session = useSelector((state) => state.session);
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();
  const router = useRouter();

  useEffect(() => {
    if (session.loggedIn === 'false') {
      history.push('/ingreso');
    } else if (
      !JSON.parse(session.roles).some((sessionRole) => {
        return roles.includes(sessionRole.role);
      }) ||
      (denyReadOnly &&
        JSON.parse(session.roles).some((sessionRole) => {
          return (
            roles.includes(sessionRole.role) && sessionRole.readOnly === 'true'
          );
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

AuthGuard.defaultProps = {
  roles: [],
  denyReadOnly: false,
};

export default AuthGuard;
