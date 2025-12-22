import { lazy } from 'react';
import { RouteObject } from 'react-router';
import Landing from '../views/Landing';
import Privacy from '../views/Privacy';
import NotFound from '../views/NotFound';
import LazyRoute from './LazyRoute';

// Lazy load admin components
const AdminLayout = lazy(() => import('../Layouts/AdminLayout'));
const Login = lazy(() => import('../views/Admin/Login'));
const Dashboard = lazy(() => import('../views/Admin/Dashboard'));
const AdminContent = lazy(() => import('../views/Admin/AdminContent'));
const AdminUsers = lazy(() => import('../views/Admin/AdminUsers/AdminUsers'));
const AdminMerchandise = lazy(() => import('../views/Admin/AdminMerchandise'));
const CloudStatus = lazy(() => import('../views/Admin/CloudStatus/CloudStatus'));
const Unsubscribe = lazy(() => import('../views/Unsubscribe'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/admin',
    element: <LazyRoute component={AdminLayout} />,
    children: [
      {
        path: 'login',
        index: true,
        element: <LazyRoute component={Login} />,
      },
      {
        path: 'dashboard',
        element: <LazyRoute component={Dashboard} />,
        children: [
          {
            index: true,
            element: <LazyRoute component={AdminContent} />,
          },
          {
            path: 'users',
            element: <LazyRoute component={AdminUsers} />,
          },
          {
            path: 'merchandise',
            element: <LazyRoute component={AdminMerchandise} />,
          },
          {
            path: 'supabase-status',
            element: <LazyRoute component={CloudStatus} />,
          },
        ],
      },
    ],
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    path: '/unsubscribe',
    element: <LazyRoute component={Unsubscribe} />,
  },
  {
    path: '404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
