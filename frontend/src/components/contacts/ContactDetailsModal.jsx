import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  Calendar,
  User,
  DollarSign,
  Tag,
  MessageSquare,
  Star,
  StarOff,
  MoreHorizontal
} from 'lucide-react'
import toast from 'react-hot-toast'

const ContactDetailsModal = ({ 
  contact, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onToggleFavorite 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!contact || !isOpen) return null

  const handleDelete = () => {
    onDelete(contact.id)
    setShowDeleteConfirm(false)
    onClose()
    toast.success('Contact deleted successfully')
  }

  const handleEdit = () => {
    onEdit(contact)
    onClose()
  }

  const handleToggleFavorite = () => {
    onToggleFavorite(contact.id)
    toast.success(contact.isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'lead': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'prospect': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getContactTypeColor = (type) => {
    switch (type) {
      case 'investor': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'customer': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'partner': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'vendor': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'employee': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Contact Details</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {contact.isFavorite ? (
                    <Star className="w-5 h-5 fill-current" />
                  ) : (
                    <StarOff className="w-5 h-5" />
                  )}
                </button>
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
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{contact.name}</h3>
                <p className="text-white/80">{contact.title} at {contact.company}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Status and Type */}
            <div className="flex items-center space-x-3 mb-6">
              <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(contact.status)}`}>
                {contact.status?.charAt(0).toUpperCase() + contact.status?.slice(1)}
              </span>
              <span className={`px-3 py-1 text-sm rounded-full border ${getContactTypeColor(contact.type)}`}>
                {contact.type?.charAt(0).toUpperCase() + contact.type?.slice(1)}
              </span>
              {contact.tags?.map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                
                {contact.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-gray-900">{contact.email}</p>
                    </div>
                  </div>
                )}

                {contact.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-900">{contact.phone}</p>
                    </div>
                  </div>
                )}

                {contact.company && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="text-gray-900">{contact.company}</p>
                    </div>
                  </div>
                )}

                {contact.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900">{contact.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 mb-3">Additional Details</h4>
                
                {contact.dealValue && (
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Deal Value</p>
                      <p className="text-gray-900">₹{contact.dealValue.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Added</p>
                    <p className="text-gray-900">{formatDate(contact.createdAt)}</p>
                  </div>
                </div>

                {contact.lastContact && (
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Last Contact</p>
                      <p className="text-gray-900">{formatDate(contact.lastContact)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {contact.notes && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{contact.notes}</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send Email
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Schedule Call
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Create Deal
                </button>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Add Note
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Contact</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete {contact.name}? This action cannot be undone.
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
                      Delete
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

export default ContactDetailsModal