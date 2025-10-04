export const secureStorage = {
  setToken: (token) => {
    // In production, consider using httpOnly cookies instead
    localStorage.setItem('token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return null;
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  },
  
  removeUser: () => {
    localStorage.removeItem('user');
  },
  
  setWorkspace: (workspace) => {
    localStorage.setItem('workspace', JSON.stringify(workspace));
  },
  
  getWorkspace: () => {
    try {
      const workspace = localStorage.getItem('workspace');
      if (!workspace) return null;
      return JSON.parse(workspace);
    } catch (error) {
      console.error('Error parsing workspace from storage:', error);
      return null;
    }
  },
  
  removeWorkspace: () => {
    localStorage.removeItem('workspace');
  },
  
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('workspace');
  }
};