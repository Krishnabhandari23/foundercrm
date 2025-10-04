import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDashboard } from '../context/DashboardContext'
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  Calendar,
  Plus,
  ArrowRight,
  Target,
  DollarSign,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react'
import TodaysTasks from '../components/dashboard/TodaysTasks'
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines'
import RecentInteractions from '../components/dashboard/RecentInteractions'
import PipelineOverview from '../components/dashboard/PipelineOverview'
import QuickAddButtons from '../components/dashboard/QuickAddButtons'
import StatsCards from '../components/dashboard/StatsCards'

const Dashboard = () => {
  const { notifications, taskUpdates, handleTaskUpdate } = useDashboard();
  const [teamActivity, setTeamActivity] = useState([]);
  const currentHour = new Date().getHours();

  // Listen for WebSocket task updates
  useEffect(() => {
    const handleWebSocketTaskUpdate = (event) => {
      const { task, notification } = event.detail;
      handleTaskUpdate(task);
      
      // Add to team activity
      setTeamActivity(prev => [{
        id: Date.now(),
        title: 'Task Update',
        description: notification.content,
        time: 'Just now',
        icon: CheckCircle,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      }, ...prev.slice(0, 9)]);
    };
    
    window.addEventListener('taskUpdate', handleWebSocketTaskUpdate);
    return () => window.removeEventListener('taskUpdate', handleWebSocketTaskUpdate);
  }, [handleTaskUpdate]);
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning'
    if (currentHour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, John! 👋
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your startup today
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Quick Add
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Add Buttons */}
      <QuickAddButtons />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Today's Tasks */}
        <div className="lg:col-span-1">
          <TodaysTasks />
        </div>

        {/* Middle Column - Pipeline Overview */}
        <div className="lg:col-span-1">
          <PipelineOverview />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Upcoming Deadlines */}
          <UpcomingDeadlines />
          
          {/* Recent Interactions */}
          <RecentInteractions />
        </div>
      </div>

      {/* Activity Feed - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {[...teamActivity, ...baseActivity].slice(0, 10).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`p-2 rounded-full ${activity.iconBg}`}>
                <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Combine hardcoded activities with team activity
const baseActivity = [
  {
    id: 1,
    title: 'New deal created',
    description: 'TechCorp deal worth ₹25,000 added to pipeline',
    time: '2 minutes ago',
    icon: DollarSign,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 2,
    title: 'Task completed',
    description: 'Follow up call with Sarah Johnson completed',
    time: '15 minutes ago',
    icon: CheckCircle,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 3,
    title: 'Contact updated',
    description: 'Mike Chen profile updated with new company info',
    time: '1 hour ago',
    icon: Users,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 4,
    title: 'Meeting scheduled',
    description: 'Demo call with InnovateCorp scheduled for tomorrow',
    time: '2 hours ago',
    icon: Calendar,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  }
]

export default Dashboard