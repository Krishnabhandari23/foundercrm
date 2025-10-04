import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ContactsPage from '../pages/ContactsPage';
import DealsPage from '../pages/DealsPage';
import TasksPage from '../pages/TasksPage';
import SettingsPage from '../pages/SettingsPage';
import TeamPage from '../pages/TeamPage';
import AdminPage from '../pages/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/contacts/*',
    element: (
      <ProtectedRoute>
        <ContactsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/deals/*',
    element: (
      <ProtectedRoute>
        <DealsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tasks/*',
    element: (
      <ProtectedRoute>
        <TasksPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/team/*',
    element: (
      <ProtectedRoute>
        <TeamPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
]);