import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { format, addDays, isToday, isTomorrow } from 'date-fns'

const UpcomingDeadlines = () => {
  const deadlines = [
    {
      id: 1,
      title: 'Investor pitch presentation',
      description: 'Series A pitch to Venture Partners',
      dueDate: new Date(),
      priority: 'high',
      type: 'meeting',
      relatedTo: 'Venture Partners'
    },
    {
      id: 2,
      title: 'Product demo for TechCorp',
      description: 'Live demo of new features',
      dueDate: addDays(new Date(), 1),
      priority: 'high',
      type: 'demo',
      relatedTo: 'TechCorp'
    },
    {
      id: 3,
      title: 'Quarterly report submission',
      description: 'Submit Q3 financial report',
      dueDate: addDays(new Date(), 2),
      priority: 'medium',
      type: 'document',
      relatedTo: 'Internal'
    },
    {
      id: 4,
      title: 'Contract review with legal',
      description: 'Review partnership agreement',
      dueDate: addDays(new Date(), 3),
      priority: 'medium',
      type: 'meeting',
      relatedTo: 'Legal Team'
    },
    {
      id: 5,
      title: 'Follow up with investors',
      description: 'Send traction metrics update',
      dueDate: addDays(new Date(), 5),
      priority: 'low',
      type: 'task',
      relatedTo: 'Multiple investors'
    }
  ]

  const getDateDisplay = (date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM dd')
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return '🤝'
      case 'demo': return '🖥️'
      case 'document': return '📄'
      case 'task': return '✅'
      default: return '📋'
    }
  }

  const getDaysUntil = (date) => {
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          View all
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {deadlines.map((deadline, index) => {
          const daysUntil = getDaysUntil(deadline.dueDate)
          const isUrgent = daysUntil <= 1
          
          return (
            <motion.div
              key={deadline.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`relative p-4 border rounded-lg transition-all duration-200 hover:shadow-sm ${
                isUrgent ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Priority indicator */}
              <div className="absolute top-2 right-2">
                {isUrgent && <AlertTriangle className="w-4 h-4 text-red-500" />}
              </div>

              <div className="flex items-start space-x-3">
                {/* Date column */}
                <div className="flex-shrink-0 text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                    isUrgent 
                      ? 'bg-red-100 border-2 border-red-300' 
                      : 'bg-blue-100 border-2 border-blue-300'
                  }`}>
                    {getTypeIcon(deadline.type)}
                  </div>
                  <div className="mt-2">
                    <p className={`text-xs font-medium ${
                      isUrgent ? 'text-red-700' : 'text-blue-700'
                    }`}>
                      {getDateDisplay(deadline.dueDate)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(deadline.dueDate, 'HH:mm')}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {deadline.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(deadline.priority)}`}>
                      {deadline.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{deadline.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {deadline.relatedTo}
                    </div>
                    
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Urgency indicator line */}
              {isUrgent && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-lg"></div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Add deadline button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Add deadline
      </motion.button>
    </motion.div>
  )
}

export default UpcomingDeadlines