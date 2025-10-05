import { createContext, useContext } from 'react';

export const DashboardContext = createContext({
  activeView: null,
  setActiveView: () => {},
  dashboardData: null,
  updateDashboardData: () => {},
  notifications: [],
  taskUpdates: [],
  handleTaskUpdate: () => {},
  filters: {},
  updateFilters: () => {},
  lastUpdate: null,
  syncDashboard: () => {}
});

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};