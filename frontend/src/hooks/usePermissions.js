import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS } from '../utils/permissions';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (role) => {
    if (!user || !user.role) return false;
    return user.role === role;
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;

    // Founder has all permissions
    if (user.role === 'founder') return true;

    // Check if user's role has the required permission
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    return rolePermissions.includes(permission) || rolePermissions.includes('*');
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(hasPermission);
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every(hasPermission);
  };

  const getAvailablePermissions = () => {
    if (!user || !user.role) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  };

  return {
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getAvailablePermissions
  };
};