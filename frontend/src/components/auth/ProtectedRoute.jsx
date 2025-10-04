import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS, ROLES } from '../../utils/permissions';

// Route definitions with permissions
export const PROTECTED_ROUTES = {
  // Dashboard routes
  '/dashboard': {
    permission: PERMISSIONS.VIEW_REPORTS,
    roles: [ROLES.FOUNDER, ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]
  },
  '/dashboard/founder': {
    roles: [ROLES.FOUNDER]
  },
  '/dashboard/team': {
    permission: PERMISSIONS.VIEW_TEAM_STATS,
    roles: [ROLES.ADMIN, ROLES.MANAGER]
  },
  
  // Contact management
  '/contacts': {
    permission: PERMISSIONS.VIEW_CONTACTS
  },
  '/contacts/new': {
    permission: PERMISSIONS.CREATE_CONTACT
  },
  '/contacts/edit': {
    permission: PERMISSIONS.EDIT_CONTACT
  },
  
  // Deal management
  '/deals': {
    permission: PERMISSIONS.VIEW_DEALS
  },
  '/deals/new': {
    permission: PERMISSIONS.CREATE_DEAL
  },
  '/deals/edit': {
    permission: PERMISSIONS.EDIT_DEAL
  },
  
  // Task management
  '/tasks': {
    permission: PERMISSIONS.VIEW_TASKS
  },
  '/tasks/new': {
    permission: PERMISSIONS.CREATE_TASK
  },
  '/tasks/edit': {
    permission: PERMISSIONS.EDIT_TASK
  },
  
  // Team management
  '/team': {
    permission: PERMISSIONS.VIEW_TEAM
  },
  '/team/manage': {
    permission: PERMISSIONS.MANAGE_TEAM,
    roles: [ROLES.FOUNDER, ROLES.ADMIN]
  },
  
  // Settings and administration
  '/settings': {
    permission: PERMISSIONS.VIEW_SETTINGS
  },
  '/admin': {
    permission: PERMISSIONS.ADMIN_ACCESS,
    roles: [ROLES.FOUNDER, ROLES.ADMIN]
  }
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, hasPermission, hasRole } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  const routeConfig = PROTECTED_ROUTES[location.pathname];
  if (routeConfig) {
    // Check permission if specified
    if (routeConfig.permission && !hasPermission(routeConfig.permission)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Check role if specified
    if (routeConfig.roles && !routeConfig.roles.some(role => hasRole(role))) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return children;
};