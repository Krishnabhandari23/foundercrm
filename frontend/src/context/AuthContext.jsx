import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import { secureStorage } from '../utils/secureStorage';
import { handleAPIError } from '../utils/errorHandling';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

// Permission and role constants
export const USER_ROLES = {
  FOUNDER: 'founder',
  TEAM_MEMBER: 'team_member',
  ADMIN: 'admin'
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_TEAM: 'manage_team',
  MANAGE_DEALS: 'manage_deals',
  VIEW_REPORTS: 'view_reports',
  MANAGE_CONTACTS: 'manage_contacts',
  MANAGE_TASKS: 'manage_tasks',
  MANAGE_MEETINGS: 'manage_meetings',
  VIEW_ALL_DATA: 'view_all_data'
};

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default role permissions mapping
const DEFAULT_ROLE_PERMISSIONS = {
  [USER_ROLES.FOUNDER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.MANAGE_DEALS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_CONTACTS,
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.MANAGE_MEETINGS,
    PERMISSIONS.VIEW_ALL_DATA
  ],
  [USER_ROLES.TEAM_MEMBER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_DEALS,
    PERMISSIONS.MANAGE_CONTACTS,
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.MANAGE_MEETINGS
  ],
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_ALL_DATA
  ]
};

const extractMessage = (error) => {
  try {
    // If it's a direct error message (from our interceptor)
    if (error instanceof Error) {
      return error.message;
    }

    // Check for response data
    const responseData = error.response?.data;
    if (responseData) {
      // Handle stub mode responses
      if (typeof responseData.success === 'boolean' && !responseData.success) {
        return responseData.message || 'Operation failed';
      }
      
      // Handle regular API error responses
      if (responseData.detail) {
        if (Array.isArray(responseData.detail)) {
          return responseData.detail.map(e => e.msg || e.message || e).join(', ');
        }
        if (typeof responseData.detail === 'object') {
          return responseData.detail.msg || responseData.detail.message || JSON.stringify(responseData.detail);
        }
        return responseData.detail;
      }
      
      // Check for message in different formats
      if (responseData.message) return responseData.message;
      if (responseData.error) return responseData.error;
      if (typeof responseData === 'string') return responseData;
    }

    // Handle specific error types
    if (error.message === 'Network Error') {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    if (error.status === 401 || error.status === 403) {
      return 'Your session has expired. Please log in again.';
    }

    // Generic error message
    return error.message || 'An unexpected error occurred. Please try again later.';
  } catch (e) {
    // Fallback for any errors during error extraction
    console.error('Error while extracting error message:', e);
    return 'An unexpected error occurred. Please try again later.';
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshingToken, setRefreshingToken] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState([]);

  // Permission checking utilities
  const hasPermission = useCallback((permission) => {
    return permissions.includes(permission);
  }, [permissions]);

  const hasRole = useCallback((role) => {
    return userRole === role;
  }, [userRole]);

  const isFounder = useCallback(() => {
    return userRole === USER_ROLES.FOUNDER;
  }, [userRole]);

  const isTeamMember = useCallback(() => {
    return userRole === USER_ROLES.TEAM_MEMBER;
  }, [userRole]);

  const isAdmin = useCallback(() => {
    return userRole === USER_ROLES.ADMIN;
  }, [userRole]);

  const logout = useCallback(() => {
    setUser(null);
    setWorkspace(null);
    setUserRole(null);
    setPermissions([]);
    secureStorage.clear();
    try {
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout toast error:', error);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    if (refreshingToken) return null;
    
    try {
      setRefreshingToken(true);
      const response = await authAPI.refreshToken();
      const { access_token } = response.data;
      
      if (!access_token) {
        throw new Error('No token received from refresh');
      }
      
      // Decode and validate the new token
      const decoded = jwtDecode(access_token);
      const role = decoded.role || USER_ROLES.TEAM_MEMBER;
      const workspace = decoded.workspace_id;

      // Update role and permissions
      setUserRole(role);
      setWorkspace({ id: workspace });
      setPermissions(DEFAULT_ROLE_PERMISSIONS[role] || []);
      
      secureStorage.setToken(access_token);
      return access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    } finally {
      setRefreshingToken(false);
    }
  }, [refreshingToken, logout]);

  const validateSession = useCallback(async () => {
    try {
      const token = secureStorage.getToken();
      if (!token) {
        console.log('No token found');
        return false;
      }

      // Attempt to decode token
      let decoded;
      try {
        if (!token || typeof token !== 'string' || !token.includes('.')) {
          console.log('Invalid token format');
          return false;
        }
        decoded = jwtDecode(token);
        if (!decoded || typeof decoded !== 'object') {
          console.log('Invalid token payload');
          return false;
        }

        // Extract role and workspace information
        const role = decoded.role || USER_ROLES.TEAM_MEMBER;
        const workspace = decoded.workspace_id;

        // Update user role and permissions
        setUserRole(role);
        setWorkspace({ id: workspace });
        setPermissions(DEFAULT_ROLE_PERMISSIONS[role] || []);
      } catch (error) {
        console.error('Token decode failed:', error);
        return false;
      }

      // Validate token contents
      if (!decoded.sub || !decoded.exp) {
        console.log('Token missing required claims');
        return false;
      }

      // Check token expiry
      const expiryTime = decoded.exp * 1000;
      const now = Date.now();
      
      // If token is expired or about to expire in the next minute
      if (now >= expiryTime - 60000) {
        console.log('Token expired or expiring soon, attempting refresh');
        try {
          const newToken = await refreshToken();
          return !!newToken;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          return false;
        }
      }
      
      // Set up refresh timer for valid token
      const refreshTime = expiryTime - now - 60000;
      if (refreshTime > 0) {
        setTimeout(() => refreshToken(), refreshTime);
      }

      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }, [refreshToken]);

  const checkAuth = useCallback(async () => {
    try {
        // Check both token and user data
        const token = secureStorage.getToken();
        const existingUser = secureStorage.getUser();
        
        if (!token || !existingUser) {
          console.log('No token or user data found, clearing auth state');
          logout();
          setLoading(false);
          return;
        }

        const isValid = await validateSession();
        if (!isValid) {
          console.log('Invalid session, logging out');
          logout();
          setLoading(false);
          return;
        }

        // Get latest user data from API
        const response = await authAPI.getCurrentUser();
        const userData = response.data;
        
        if (!userData || typeof userData !== 'object') {
          throw new Error('Invalid user data from server');
        }
        
        const role = userData.role || existingUser.role || USER_ROLES.TEAM_MEMBER;
        const userWithRole = {
          ...userData,
          role
        };
        
        setUser(userWithRole);
        setUserRole(role);
        setPermissions(DEFAULT_ROLE_PERMISSIONS[role] || []);
        secureStorage.setUser(userWithRole);

        // Handle workspace data
        const workspaceData = userData.workspace || secureStorage.getWorkspace();
        if (workspaceData) {
          setWorkspace(workspaceData);
          setWorkspace({ id: workspaceData.id });
          secureStorage.setWorkspace(workspaceData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        console.error('Auth check failed:', error);
        logout();
        setLoading(false);
      }
    }, [validateSession, logout]);

  useEffect(() => {
    if (!initialized) {
      checkAuth().finally(() => {
        setInitialized(true);
      });
    }
  }, [checkAuth, initialized]);  const login = async (email, password, loginType = 'founder') => {
    try {
      const response = await authAPI.login({
        email,
        password,
        login_type: loginType
      });

      // Extract data from response
      const responseData = response.data;
      
      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      // Handle successful response structure
      const data = responseData.success ? responseData.data : responseData;
      
      // Extract token from response
      const token = data.access_token || data.token;
      if (!token) {
        console.error('Response data:', responseData);
        throw new Error('No access token in server response');
      }
      
      // Validate and decode token
      let tokenData;
      try {
        tokenData = jwtDecode(token);
        if (!tokenData || typeof tokenData !== 'object') {
          throw new Error('Token payload is not a valid JSON object');
        }
      } catch (error) {
        console.error('Token decode error:', error);
        throw new Error(`Invalid token format: ${error.message}`);
      }

      // Store token securely
      secureStorage.setToken(token);

      // Set up refresh timer if token has expiry
      if (tokenData.exp) {
        const refreshTime = (tokenData.exp * 1000) - Date.now() - 60000; // Refresh 1 minute before expiry
        if (refreshTime > 0) {
          setTimeout(() => refreshToken(), refreshTime);
        }
      }

      // Extract user data from response or token
      // Extract user data from response
      const userData = data.user;
      if (!userData) {
        throw new Error('No user data in server response');
      }
      
      // Create user object with role
      const userWithRole = {
        ...userData,
        id: userData.id,
        email: userData.email,
        role: userData.role || loginType,
        name: userData.name || email.split('@')[0],
      };
      
      // Store user data
      secureStorage.setUser(userWithRole);
      setUser(userWithRole);

      // Handle workspace data
      const workspaceData = userData?.workspace || {
        id: userData?.workspace_id || '1',
        name: userData?.workspace_name || 'My Workspace',
      };
      secureStorage.setWorkspace(workspaceData);
      setWorkspace(workspaceData);

      return userWithRole;
    } catch (error) {
      const errorMessage = extractMessage(error);
      console.error('Login failed:', error);
      
      // Clear any existing auth state on login failure
      logout();
      
      // Show error to user
      toast.error(errorMessage);
      
      throw new Error(errorMessage);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      const { token, user, workspace } = response.data;

      // Store token
      if (token) {
        secureStorage.setToken(token);
      }

      // Store user data with role
      const role = user.role || USER_ROLES.FOUNDER; // New signups are founders by default
      const userWithRole = {
        ...user,
        role
      };
      secureStorage.setUser(userWithRole);
      setUser(userWithRole);
      setUserRole(role);
      setPermissions(DEFAULT_ROLE_PERMISSIONS[role] || []);

      // Store workspace data
      if (workspace) {
        secureStorage.setWorkspace(workspace);
        setWorkspace(workspace);
      }

      toast.success('Account created successfully!');
      return userWithRole;
    } catch (error) {
      const errorMessage = extractMessage(error);
      console.error('Signup failed:', error);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  const value = {
    user,
    workspace,
    loading,
    initialized,
    login,
    signup,
    logout,
    validateSession,
    isAuthenticated: !!user && !!workspace,
    // RBAC utilities
    userRole,
    permissions,
    hasPermission,
    hasRole,
    isFounder,
    isTeamMember,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Used for imports only - use useAuth() hook to access auth functionality
export default AuthContext;
