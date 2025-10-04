import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [previousRoute, setPreviousRoute] = useState(null);
  const [navigationStack, setNavigationStack] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setPreviousRoute(location.pathname);
    setNavigationStack(prev => [...prev, location.pathname].slice(-5));
  }, [location]);

  const getBreadcrumbLabel = (path) => {
    const mapping = {
      '/': 'Home',
      '/dashboard': 'Dashboard',
      '/contacts': 'Contacts',
      '/deals': 'Deals',
      '/tasks': 'Tasks',
      '/team': 'Team',
      '/settings': 'Settings'
    };
    return mapping[path] || path;
  };

  const updateBreadcrumbs = (items) => {
    setBreadcrumbs(items.map(item => ({
      ...item,
      label: item.label || getBreadcrumbLabel(item.path)
    })));
  };

  const canGoBack = navigationStack.length > 1;

  const value = {
    breadcrumbs,
    updateBreadcrumbs,
    previousRoute,
    canGoBack,
    navigationStack
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};