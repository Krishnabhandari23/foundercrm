import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardStats, DashboardCharts, ActivityFeed } from './DashboardComponents';
import { RequireRole } from '../auth/ProtectedComponents';
import { ROLES } from '../../utils/permissions';
import useWebSocket from '../../hooks/useWebSocket';

const FounderDashboard = ({ data }) => {
  return (
    <RequireRole role={ROLES.FOUNDER}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Founder Dashboard</h2>
          <div className="flex space-x-4">
            <button className="btn-primary">Export Reports</button>
            <button className="btn-secondary">Team Settings</button>
          </div>
        </div>

        <DashboardStats data={data.stats} />
        <DashboardCharts data={data.charts} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Team Performance</h3>
            {/* Team performance metrics */}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Company Growth</h3>
            {/* Growth metrics */}
          </div>
        </div>
        
        <ActivityFeed activities={data.activities} />
      </div>
    </RequireRole>
  );
};

const TeamMemberDashboard = ({ data }) => {
  return (
    <RequireRole role={ROLES.TEAM_MEMBER}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Dashboard</h2>
          <button className="btn-primary">Add Task</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">My Tasks</h3>
            <p className="text-3xl font-bold">{data.stats.myTasks}</p>
            <span className="text-yellow-500 text-sm">
              {data.stats.urgentTasks} urgent
            </span>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">My Deals</h3>
            <p className="text-3xl font-bold">{data.stats.myDeals}</p>
            <span className="text-green-500 text-sm">
              ${data.stats.dealValue} potential value
            </span>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">This Week</h3>
            <p className="text-3xl font-bold">{data.stats.weeklyTasks}</p>
            <span className="text-blue-500 text-sm">
              {data.stats.completedTasks} completed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">My Task List</h3>
            {/* Task list component */}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">My Active Deals</h3>
            {/* Active deals component */}
          </div>
        </div>
        
        <ActivityFeed activities={data.activities} />
      </div>
    </RequireRole>
  );
};

const Dashboard = () => {
  const { userRole } = useAuth();
  const { sendMessage } = useWebSocket();
  const [dashboardData, setDashboardData] = React.useState(null);
  
  React.useEffect(() => {
    // Initial data fetch
    fetchDashboardData();
    
    // Subscribe to real-time updates
    sendMessage('subscribe', { channel: 'dashboard_updates' });
  }, [userRole]);
  
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {userRole === ROLES.FOUNDER ? (
        <FounderDashboard data={dashboardData} />
      ) : (
        <TeamMemberDashboard data={dashboardData} />
      )}
    </div>
  );
};

export default Dashboard;