import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { useWebSocket, WS_MESSAGE_TYPES } from '../../hooks/useWebSocket';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardContext } from './DashboardContext';

export const DashboardProvider = React.memo(({ children }) => {
  const { user } = useAuth();
  const { sendMessage } = useWebSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [taskUpdates, setTaskUpdates] = useState([]);
  const [filters, setFilters] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);

  // Initialize view based on role and URL
  useEffect(() => {
    if (user?.role) {
      const view = location.pathname.includes('founder') ? 'founder' : 
                  location.pathname.includes('team') ? 'team' : 
                  user.role === 'founder' ? 'founder' : 'team';
      setActiveView(view);
    }
  }, [user, location]);

  // Sync state on view change
  useEffect(() => {
    if (activeView && dashboardData) {
      sendMessage({
        type: WS_MESSAGE_TYPES.DASHBOARD_STATE,
        payload: {
          dashboard_type: activeView,
          filters,
          data: dashboardData,
          timestamp: Date.now() / 1000
        }
      });
    }
  }, [activeView, dashboardData, filters, sendMessage]);

  // Handle WebSocket events
  useEffect(() => {
    const handleDashboardState = (event) => {
      const { sourceUserId, dashboardType, filters: newFilters, data } = event.detail;
      
      if (sourceUserId !== user?.id) {
        setActiveView(dashboardType);
        setFilters(newFilters);
        setDashboardData(data);
        setLastUpdate(new Date().toISOString());
        
        const newPath = `/${dashboardType}-dashboard`;
        if (location.pathname !== newPath) {
          navigate(newPath);
        }
      }
    };

    const handleDashboardSync = (event) => {
      const { sourceUserId, dashboardType, filters: newFilters, data } = event.detail;
      
      if (sourceUserId !== user?.id) {
        setActiveView(dashboardType);
        setFilters(newFilters);
        setDashboardData(data);
        setLastUpdate(new Date().toISOString());
        
        const newPath = `/${dashboardType}-dashboard`;
        if (location.pathname !== newPath) {
          navigate(newPath);
        }
      }
    };

    window.addEventListener('dashboardState', handleDashboardState);
    window.addEventListener('dashboardSync', handleDashboardSync);

    return () => {
      window.removeEventListener('dashboardState', handleDashboardState);
      window.removeEventListener('dashboardSync', handleDashboardSync);
    };
  }, [user, navigate, location]);

  const handleTaskUpdate = useCallback((taskData) => {
    const notification = {
      id: Date.now(),
      type: 'task_update',
      content: taskData.beautifiedMessage || `Task "${taskData.title}" updated`,
      timestamp: new Date().toISOString(),
    };
    
    setNotifications(prev => [notification, ...prev]);
    setLastUpdate(new Date().toISOString());
    setTaskUpdates(prev => [taskData, ...prev]);
    
    sendMessage({
      type: WS_MESSAGE_TYPES.TASK_UPDATE,
      payload: {
        task: taskData,
        notification
      }
    });

    sendMessage({
      type: WS_MESSAGE_TYPES.DASHBOARD_STATE,
      payload: {
        dashboard_type: activeView,
        filters,
        data: dashboardData,
        timestamp: Date.now() / 1000
      }
    });
  }, [activeView, dashboardData, filters, sendMessage]);

  const syncDashboard = useCallback((targetUserId) => {
    sendMessage({
      type: WS_MESSAGE_TYPES.DASHBOARD_SYNC,
      payload: {
        target_user_id: targetUserId,
        dashboard_type: activeView,
        filters,
        data: dashboardData,
        timestamp: Date.now() / 1000
      }
    });
  }, [activeView, dashboardData, filters, sendMessage]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    sendMessage({
      type: WS_MESSAGE_TYPES.DASHBOARD_FILTER,
      payload: {
        filters: newFilters,
        timestamp: Date.now() / 1000
      }
    });
  }, [sendMessage]);

  const updateDashboardData = useCallback((newData) => {
    setDashboardData(prev => ({ ...prev, ...newData }));
  }, []);

  const value = useMemo(() => ({
    activeView,
    setActiveView,
    dashboardData,
    updateDashboardData,
    notifications,
    taskUpdates,
    handleTaskUpdate,
    filters,
    updateFilters,
    lastUpdate,
    syncDashboard
  }), [
    activeView,
    dashboardData,
    notifications,
    taskUpdates,
    filters,
    lastUpdate,
    updateDashboardData,
    handleTaskUpdate,
    updateFilters,
    syncDashboard
  ]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
});