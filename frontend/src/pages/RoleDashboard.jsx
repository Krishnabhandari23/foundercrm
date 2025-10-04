import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import Dashboard from './Dashboard';
import TeamMemberDashboard from './TeamMemberDashboard';

const RoleDashboard = () => {
  const { user } = useAuth();
  const { activeView, setActiveView } = useDashboard();
  
  // Update activeView when user role changes
  React.useEffect(() => {
    if (user?.role && activeView !== user.role) {
      setActiveView(user.role);
    }
  }, [user?.role, activeView, setActiveView]);
  
  // Persist the dashboard view based on activeView state
  if (activeView === 'founder') {
    return <Dashboard />;
  }
  
  return <TeamMemberDashboard />;
};

export default RoleDashboard;