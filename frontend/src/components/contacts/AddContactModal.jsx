import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  DollarSign,
  Tag,
  FileText,
  Save,
  Upload,
  Camera
} from 'lucide-react'
import toast from 'react-hot-toast'

const AddContactModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    type: 'lead',
    status: 'cold',
    dealValue: '',
    notes: '',
    tags: [],
    address: '',
    website: '',
    avatar: ''
  })

  const [selectedTags, setSelectedTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)

  const contactTypes = [
    { value: 'customer', label: 'Customer', icon: '👤', color: 'emerald' },
    { value: 'lead', label: 'Lead', icon: '🎯', color: 'blue' },
    { value: 'partner', label: 'Partner', icon: '🤝', color: 'purple' },
    { value: 'investor', label: 'Investor', icon: '💰', color: 'orange' }
  ]

  const statusOptions = [
    { value: 'hot', label: 'Hot', color: 'red' },
    { value: 'warm', label: 'Warm', color: 'yellow' },
    { value: 'cold', label: 'Cold', color: 'blue' },
    { value: 'active', label: 'Active', color: 'green' }
  ]

  const availableTags = [
    'high-value', 'partnership', 'technical', 'demo-requested', 
    'strategic', 'referral-source', 'series-a', 'fintech-focused',
    'enterprise', 'security-focused', 'urgent', 'follow-up'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTagAdd = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
      setFormData(prev => ({
        ...prev,
        tags: [...selectedTags, tag]
      }))
    }
  }

  const handleTagRemove = (tagToRemove) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove)
    setSelectedTags(updatedTags)
    setFormData(prev => ({
      ...prev,
      tags: updatedTags
    }))
  }

  const handleCustomTagAdd = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      handleTagAdd(newTag.trim())
      setNewTag('')
    }
  }

  const generateAvatar = (name) => {
    const initials = name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const newContact = {
        ...formData,
        id: Date.now().toString(),
        avatar: formData.avatar || generateAvatar(formData.name),
        lastContact: new Date().toISOString().split('T')[0],
        tags: selectedTags,
        createdAt: new Date().toISOString()
      }

      await onSubmit(newContact)
      toast.success('Contact added successfully! 🎉')
      handleClose()
    } catch (error) {
      toast.error('Failed to add contact. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      type: 'lead',
      status: 'cold',
      dealValue: '',
      notes: '',
      tags: [],
      address: '',
      website: '',
      avatar: ''
    })
    setSelectedTags([])
    setNewTag('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Add New Contact</h3>
                  <p className="text-sm text-gray-600">Create a new contact in your CRM</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position/Title
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CEO"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deal Value
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="dealValue"
                        value={formData.dealValue}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="₹25,000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Type & Status */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Classification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {contactTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.type === type.value
                              ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={type.value}
                            checked={formData.type === type.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="text-xl mr-2">{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {statusOptions.map((status) => (
                        <label
                          key={status.value}
                          className={`relative flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.status === status.value
                              ? `border-${status.color}-500 bg-${status.color}-50 text-${status.color}-700`
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value={status.value}
                            checked={formData.status === status.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="font-medium">{status.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Tags</h4>
                <div className="space-y-3">
                  {/* Available Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagAdd(tag)}
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-100 text-blue-800 border-blue-300 cursor-default'
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                          disabled={selectedTags.includes(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Tag Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Custom Tag
                    </label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomTagAdd())}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter custom tag"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCustomTagAdd}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Selected Tags */}
                  {selectedTags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Tags ({selectedTags.length})
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag)}
                              className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Add any notes about this contact..."
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Add Contact
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default AddContactModal