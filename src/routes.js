/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { lazy } from 'react';
// import { Redirect } from 'react-router-dom';

// import AuthLayout from './layouts/Auth';
// import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
// import Principal from './views/Principal';


const routes = [
  // {
  //   path: '/error',
  //   component: ErrorLayout,
  //   routes: [
  //     {
  //       path: '/error/401',
  //       exact: true,
  //       component: lazy(() => import('views/Error401'))
  //     },
  //     {
  //       path: '/error/404',
  //       exact: true,
  //       component: lazy(() => import('views/Error404'))
  //     },
  //     {
  //       path: '/error/405',
  //       exact: true,
  //       component: lazy(() => import('views/Error405'))
  //     },
  //     {
  //       component: () => <Redirect to="/error/404" />
  //     }
  //   ]
  // },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      {
        path: '/',
        exact: true,
        component: lazy(() => import('./views/Principal'))
      },
    ]
  }
];

export default routes;
