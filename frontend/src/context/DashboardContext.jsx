import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket, WS_MESSAGE_TYPES } from '../hooks/useWebSocket';
import { useAtom } from 'jotai';
import {
  dashboardTypeAtom,
  taskUpdatesAtom,
  notificationsAtom,
  dashboardDataAtom,
  dashboardFiltersAtom,
  lastUpdateAtom
} from '../store/dashboardStore';
import { createTaskNotification, formatTaskUpdate } from '../services/taskService';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const { sendMessage } = useWebSocket();
  
  // Jotai state
  const [dashboardType, setDashboardType] = useAtom(dashboardTypeAtom);
  const [taskUpdates, setTaskUpdates] = useAtom(taskUpdatesAtom);
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [dashboardData, setDashboardData] = useAtom(dashboardDataAtom);
  const [filters] = useAtom(dashboardFiltersAtom);
  const [lastUpdate, setLastUpdate] = useAtom(lastUpdateAtom);

  // Initialize dashboard type based on user role
  useEffect(() => {
    if (user?.role && !dashboardType) {
      setDashboardType(user.role);
    }
  }, [user?.role, dashboardType, setDashboardType]);

  // Listen for WebSocket updates
  useEffect(() => {
    const handleTaskUpdate = (event) => {
      const taskData = event.detail;
      const formattedUpdate = formatTaskUpdate(taskData);
      const notification = createTaskNotification(taskData);

      // Update task data
      setTaskUpdates(prev => [formattedUpdate, ...prev]);
      setNotifications(prev => [notification, ...prev]);
      setLastUpdate(new Date().toISOString());

      // Send WebSocket message for real-time sync
      sendMessage({
        type: WS_MESSAGE_TYPES.TASK_UPDATE,
        payload: {
          task: taskData,
          update: formattedUpdate,
          notification
        }
      });

      // Also update dashboard state
      sendMessage({
        type: WS_MESSAGE_TYPES.DASHBOARD_STATE,
        payload: {
          dashboard_type: dashboardType,
          filters,
          data: dashboardData,
          timestamp: Date.now() / 1000
        }
      });
    };

    const handleBeautifiedStatus = (event) => {
      const { taskId, status } = event.detail;
      
      // Update dashboard data with beautified status
      setDashboardData(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId
            ? { ...task, beautified_status_message: status }
            : task
        )
      }));
    };

    const handleDashboardState = (event) => {
      const { sourceUserId, dashboardType, filters, data } = event.detail;
      
      // Only update if data is from another user
      if (sourceUserId !== user.id) {
        setDashboardType(dashboardType);
        setDashboardData(data);
        setLastUpdate(new Date().toISOString());
      }
    };

    window.addEventListener('taskUpdate', handleTaskUpdate);
    window.addEventListener('beautifiedStatus', handleBeautifiedStatus);
    window.addEventListener('dashboardState', handleDashboardState);

    return () => {
      window.removeEventListener('taskUpdate', handleTaskUpdate);
      window.removeEventListener('beautifiedStatus', handleBeautifiedStatus);
      window.removeEventListener('dashboardState', handleDashboardState);
    };
  }, [sendMessage, setTaskUpdates, setNotifications, setDashboardData, setLastUpdate]);

  // Send initial dashboard state when type changes
  useEffect(() => {
    if (dashboardType && dashboardData) {
      sendMessage({
        type: WS_MESSAGE_TYPES.DASHBOARD_STATE,
        payload: {
          dashboard_type: dashboardType,
          filters,
          data: dashboardData,
          timestamp: Date.now() / 1000
        }
      });
    }
  }, [dashboardType, sendMessage]);

  // Context value
  const value = {
    dashboardType,
    setDashboardType,
    taskUpdates,
    notifications,
    dashboardData,
    filters,
    lastUpdate,
    updateTask: (taskData) => {
      window.dispatchEvent(new CustomEvent('taskUpdate', { detail: taskData }));
    },
    syncDashboard: (targetUserId) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.DASHBOARD_SYNC,
        payload: {
          target_user_id: targetUserId,
          dashboard_type: dashboardType,
          filters,
          data: dashboardData,
          timestamp: Date.now() / 1000
        }
      });
    }
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};