import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequirePermission = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return fallback || <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export const RequireRole = ({ role, children, fallback = null }) => {
  const { hasRole } = useAuth();
  
  if (!hasRole(role)) {
    return fallback || <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export const RequireFounder = ({ children, fallback = null }) => {
  const { isFounder } = useAuth();
  
  if (!isFounder()) {
    return fallback || <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export const RequireTeamMember = ({ children, fallback = null }) => {
  const { isTeamMember } = useAuth();
  
  if (!isTeamMember()) {
    return fallback || <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export const RequireAdmin = ({ children, fallback = null }) => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin()) {
    return fallback || <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export const PermissionGate = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useAuth();
  
  return hasPermission(permission) ? children : fallback;
};

export const RoleGate = ({ role, children, fallback = null }) => {
  const { hasRole } = useAuth();
  
  return hasRole(role) ? children : fallback;
};