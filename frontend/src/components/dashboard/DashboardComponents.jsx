import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../utils/permissions';

export const DashboardStats = ({ data }) => {
  const { hasPermission } = useAuth();
  const showRevenue = hasPermission(PERMISSIONS.VIEW_REPORTS);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Active Deals</h3>
        <p className="text-3xl font-bold">{data.activeDeals}</p>
        <span className="text-green-500 text-sm">
          +{data.newDeals} this week
        </span>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Open Tasks</h3>
        <p className="text-3xl font-bold">{data.openTasks}</p>
        <span className="text-yellow-500 text-sm">
          {data.urgentTasks} urgent
        </span>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Team Activity</h3>
        <p className="text-3xl font-bold">{data.activeUsers}</p>
        <span className="text-blue-500 text-sm">
          {data.totalTeamMembers} total members
        </span>
      </div>
      
      {showRevenue && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
          <p className="text-3xl font-bold">${data.revenue.toLocaleString()}</p>
          <span className={data.revenueChange >= 0 ? "text-green-500" : "text-red-500"}>
            {data.revenueChange >= 0 ? "+" : ""}{data.revenueChange}% vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export const DashboardCharts = ({ data }) => {
  const { hasPermission } = useAuth();
  const showForecast = hasPermission(PERMISSIONS.VIEW_REPORTS);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Deal Pipeline</h3>
        {/* Deal pipeline chart component */}
      </div>
      
      {showForecast && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Revenue Forecast</h3>
          {/* Revenue forecast chart component */}
        </div>
      )}
    </div>
  );
};

export const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className={`w-2 h-2 mt-2 rounded-full ${getActivityColor(activity.type)}`} />
            <div>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getActivityColor = (type) => {
  switch (type) {
    case 'deal':
      return 'bg-green-500';
    case 'task':
      return 'bg-yellow-500';
    case 'contact':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};