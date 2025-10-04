import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  MoreVertical,
  Edit,
  Trash2,
  MessageSquare,
  Calendar,
  DollarSign,
  Eye,
  Edit3
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ContactCard = ({ contact, index, onView, onEdit, onDelete }) => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'hot': return 'bg-red-100 text-red-800 border-red-200'
      case 'warm': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'churned': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'customer': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'lead': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'partner': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'investor': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'customer': return '👤'
      case 'lead': return '🎯'
      case 'partner': return '🤝'
      case 'investor': return '💰'
      default: return '📋'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6 cursor-pointer group"
      onClick={() => navigate(`/contacts/${contact.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 text-sm">
              {getTypeIcon(contact.type)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {contact.name}
            </h3>
            <p className="text-sm text-gray-600">{contact.position}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all duration-200"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {/* Dropdown Menu */}
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px] z-10"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onView?.(contact)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.(contact)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Contact</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.(contact.id)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Company */}
      <div className="flex items-center space-x-2 mb-3">
        <Building className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">{contact.company}</span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 truncate">{contact.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{contact.phone}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-1">
          <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(contact.type)}`}>
            {contact.type}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(contact.status)}`}>
            {contact.status}
          </span>
        </div>
      </div>

      {/* Deal Value */}
      {contact.dealValue && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Deal Value</span>
          </div>
          <span className="font-semibold text-green-600">{contact.dealValue}</span>
        </div>
      )}

      {/* Notes */}
      {contact.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{contact.notes}</p>
        </div>
      )}

      {/* Last Contact */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>Last contact: {new Date(contact.lastContact).toLocaleDateString()}</span>
      </div>

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {contact.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200"
            >
              {tag}
            </span>
          ))}
          {contact.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-full border border-gray-200">
              +{contact.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Handle call
          }}
          className="flex-1 flex items-center justify-center py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Phone className="w-4 h-4 mr-1" />
          Call
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Handle email
          }}
          className="flex-1 flex items-center justify-center py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Mail className="w-4 h-4 mr-1" />
          Email
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Handle message
          }}
          className="flex-1 flex items-center justify-center py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Message
        </button>
      </div>
    </motion.div>
  )
}

export default ContactCard