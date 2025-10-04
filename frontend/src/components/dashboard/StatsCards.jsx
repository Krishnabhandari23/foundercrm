import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { dashboardAPI } from '../../utils/api'

const StatsCards = () => {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        if (!isMounted) return;

        const data = response.data;

        // Transform backend data to match UI format
        const { stats } = data;
        const transformedStats = [
          {
            name: 'Total Contacts',
            value: stats.totalContacts.toString(),
            change: '+5%',
            changeType: 'increase',
            icon: Users,
            gradient: 'from-emerald-500 to-teal-500',
            bgGradient: 'from-emerald-50 to-teal-50'
          },
          {
            name: 'Active Deals',
            value: stats.activeDeals.toString(),
            change: '+12%',
            changeType: 'increase',
            icon: DollarSign,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50'
          },
          {
            name: 'Tasks Status',
            value: `${stats.completedTasks}/${stats.pendingTasks + stats.completedTasks}`,
            change: `${Math.round((stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100)}%`,
            changeType: 'neutral',
            icon: CheckCircle,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50'
          },
          {
            name: 'Revenue Pipeline',
            value: data.revenue_pipeline ? `₹${(data.revenue_pipeline / 1000).toFixed(0)}K` : '₹0K',
            change: data.revenue_change || '+0%',
            changeType: data.revenue_change?.startsWith('+') ? 'increase' : 'decrease',
            icon: TrendingUp,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-50 to-red-50'
          }
        ]

        setStats(transformedStats)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
        // Fallback to default stats
        setStats([
          {
            name: 'Active Deals',
            value: '12',
            change: '+2.1%',
            changeType: 'increase',
            icon: DollarSign,
            gradient: 'from-emerald-500 to-teal-500',
            bgGradient: 'from-emerald-50 to-teal-50'
          },
          {
            name: 'Tasks Completed',
            value: '89%',
            change: '+5.4%',
            changeType: 'increase',
            icon: CheckCircle,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50'
          },
          {
            name: 'New Contacts',
            value: '24',
            change: '+12.5%',
            changeType: 'increase',
            icon: Users,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50'
          },
          {
            name: 'Revenue Pipeline',
            value: '₹127K',
            change: '-2.3%',
            changeType: 'decrease',
            icon: TrendingUp,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-50 to-red-50'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-200`}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
            <div className={`w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10`}></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.gradient} rounded-lg shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsCards