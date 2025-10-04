import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const RequirePermission = ({ 
  children, 
  permission, 
  fallback = null,
  redirectTo = '/unauthorized' 
}) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return fallback || <Navigate to={redirectTo} />;
  }

  return children;
};

export const PermissionGate = ({ 
  children, 
  permission,
  fallback = null 
}) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
};

export const RequireRole = ({ 
  children, 
  role,
  fallback = null,
  redirectTo = '/unauthorized'
}) => {
  const { hasRole } = usePermissions();
  const location = useLocation();

  if (!hasRole(role)) {
    if (fallback) return fallback;
    return <Navigate to={redirectTo} state={{ from: location }} />;
  }

  return children;
};

export const PermissionBadge = ({ permission }) => {
  const { hasPermission } = usePermissions();
  const granted = hasPermission(permission);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${granted 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
        }
      `}
    >
      {permission}
    </motion.span>
  );
};