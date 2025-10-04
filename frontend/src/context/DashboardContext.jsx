import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';

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
  
  // Dashboard state
  const [activeView, setActiveView] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [taskUpdates, setTaskUpdates] = useState([]);

  // Initialize the correct dashboard view based on user role
  useEffect(() => {
    if (user?.role) {
      setActiveView(user.role);
    }
  }, [user]);

  // Handle task updates and notifications
  const handleTaskUpdate = (taskData) => {
    // Add task update to notifications
    const notification = {
      id: Date.now(),
      type: 'task_update',
      content: taskData.beautifiedMessage || `Task "${taskData.title}" updated`,
      timestamp: new Date().toISOString(),
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Update task data
    setTaskUpdates(prev => [taskData, ...prev]);
    
    // Send WebSocket message for real-time sync
    sendMessage({
      type: 'task_update',
      payload: {
        task: taskData,
        notification
      }
    });
  };

  // Update dashboard data
  const updateDashboardData = (newData) => {
    setDashboardData(prev => ({
      ...prev,
      ...newData
    }));
  };

  return (
    <DashboardContext.Provider
      value={{
        activeView,
        setActiveView,
        dashboardData,
        updateDashboardData,
        notifications,
        taskUpdates,
        handleTaskUpdate
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};