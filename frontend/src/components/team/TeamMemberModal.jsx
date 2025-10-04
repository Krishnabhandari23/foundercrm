import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  DollarSign,
  Award,
  Target,
  Clock,
  TrendingUp,
  Shield,
  Crown,
  Star,
  Users,
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'

const TeamMemberModal = ({ 
  member, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!member || !isOpen) return null

  const handleDelete = () => {
    onDelete(member.id)
    setShowDeleteConfirm(false)
    onClose()
  }

  const handleEdit = () => {
    onEdit(member)
    onClose()
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'founder': return <Crown className="w-5 h-5 text-yellow-600" />
      case 'admin': return <Shield className="w-5 h-5 text-red-600" />
      case 'manager': return <Star className="w-5 h-5 text-blue-600" />
      case 'employee': return <Users className="w-5 h-5 text-gray-600" />
      default: return <Users className="w-5 h-5 text-gray-600" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'founder': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'employee': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getLastActiveText = (lastActive) => {
    const lastActiveDate = new Date(lastActive)
    const now = new Date()
    const diffHours = Math.floor((now - lastActiveDate) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Active now'
    if (diffHours < 24) return `${diffHours} hours ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} days ago`
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Team Member Details</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
              />
              <div>
                <h3 className="text-2xl font-semibold">{member.name}</h3>
                <p className="text-white/80 text-lg">{member.title}</p>
                <p className="text-white/60">{member.department}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Status and Role */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center space-x-2">
                {getRoleIcon(member.role)}
                <span className={`px-3 py-1 text-sm rounded-full border ${getRoleColor(member.role)}`}>
                  {member.role?.charAt(0).toUpperCase() + member.role?.slice(1)}
                </span>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(member.status)}`}>
                {member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                Last active: {getLastActiveText(member.lastActive)}
              </span>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Performance</p>
                    <p className="text-2xl font-bold text-blue-900">{member.performanceScore}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Tasks Completed</p>
                    <p className="text-2xl font-bold text-green-900">{member.tasksCompleted}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Deals Won</p>
                    <p className="text-2xl font-bold text-purple-900">{member.dealsWon}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Hours Worked</p>
                    <p className="text-2xl font-bold text-orange-900">{member.hoursWorked}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                
                {member.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-gray-900">{member.email}</p>
                    </div>
                  </div>
                )}

                {member.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-900">{member.phone}</p>
                    </div>
                  </div>
                )}

                {member.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900">{member.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="text-gray-900">{formatDate(member.joinDate)}</p>
                  </div>
                </div>

                {member.salary && (
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="text-gray-900">{member.salary}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900 mb-3">Skills & Permissions</h4>
                
                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Permissions */}
                {member.permissions && member.permissions.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Permissions</p>
                    <div className="space-y-1">
                      {member.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">
                            {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send Email
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Assign Task
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Schedule Meeting
                </button>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  View Performance
                </button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Team Member</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to remove {member.name} from the team? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TeamMemberModal