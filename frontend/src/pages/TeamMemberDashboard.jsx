import React, { useEffect } from 'react'
import { useDashboard } from '../context/dashboard/DashboardContext'
import TodaysTasks from '../components/team-dashboard/TodaysTasks'
import UpcomingDeadlines from '../components/team-dashboard/UpcomingDeadlines'
import ProgressOverview from '../components/team-dashboard/ProgressOverview'
import QuickAdd from '../components/team-dashboard/QuickAdd'
import Notifications from '../components/team-dashboard/Notifications'

const TeamMemberDashboard = () => {
  const { handleTaskUpdate, taskUpdates, notifications } = useDashboard();

  // Listen for WebSocket task updates
  useEffect(() => {
    const handleWebSocketTaskUpdate = (event) => {
      handleTaskUpdate(event.detail);
    };

    window.addEventListener('taskUpdate', handleWebSocketTaskUpdate);
    return () => window.removeEventListener('taskUpdate', handleWebSocketTaskUpdate);
  }, [handleTaskUpdate]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500">A quick glance at your tasks and performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <TodaysTasks onTaskUpdate={handleTaskUpdate} taskUpdates={taskUpdates} />
          <ProgressOverview />
        </div>

        <div className="lg:col-span-1">
          <UpcomingDeadlines />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <QuickAdd onTaskCreate={handleTaskUpdate} />
          <Notifications notifications={notifications} />
        </div>
      </div>
    </div>
  )
}

export default TeamMemberDashboard
