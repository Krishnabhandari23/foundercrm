import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Phone, Mail, Calendar, ArrowRight, User } from 'lucide-react'

const RecentInteractions = () => {
  const interactions = [
    {
      id: 1,
      type: 'call',
      contactName: 'Sarah Johnson',
      contactCompany: 'InnovateCorp',
      contactAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b524?w=32&h=32&fit=crop&crop=face',
      description: 'Discussed partnership opportunities and next steps',
      time: '2 hours ago',
      icon: Phone,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'email',
      contactName: 'Mike Chen',
      contactCompany: 'TechCorp',
      contactAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      description: 'Sent proposal for custom software development',
      time: '4 hours ago',
      icon: Mail,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      type: 'meeting',
      contactName: 'Emma Wilson',
      contactCompany: 'StartupHub',
      contactAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      description: 'Product demo and feature walkthrough',
      time: '1 day ago',
      icon: Calendar,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 4,
      type: 'message',
      contactName: 'David Park',
      contactCompany: 'Venture Capital',
      contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      description: 'Follow-up on investment discussion',
      time: '2 days ago',
      icon: MessageCircle,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      id: 5,
      type: 'call',
      contactName: 'Lisa Zhang',
      contactCompany: 'GrowthCorp',
      contactAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=32&h=32&fit=crop&crop=face',
      description: 'Quarterly business review call',
      time: '3 days ago',
      icon: Phone,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ]

  const getInteractionLabel = (type) => {
    switch (type) {
      case 'call': return 'Call'
      case 'email': return 'Email'
      case 'meeting': return 'Meeting'
      case 'message': return 'Message'
      default: return 'Interaction'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Interactions</h3>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          View all
        </button>
      </div>

      {/* Interactions List */}
      <div className="space-y-4">
        {interactions.map((interaction, index) => (
          <motion.div
            key={interaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={interaction.contactAvatar}
                  alt={interaction.contactName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {/* Interaction type badge */}
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${interaction.iconBg} border-2 border-white`}>
                  <interaction.icon className={`w-3 h-3 ${interaction.iconColor}`} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{interaction.contactName}</h4>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{interaction.contactCompany}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${interaction.iconBg} ${interaction.iconColor} font-medium`}>
                      {getInteractionLabel(interaction.type)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{interaction.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{interaction.time}</span>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Log interaction button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Log new interaction
      </motion.button>
    </motion.div>
  )
}

export default RecentInteractions