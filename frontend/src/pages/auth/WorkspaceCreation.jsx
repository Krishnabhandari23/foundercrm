import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Users, Mail, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const WorkspaceCreation = () => {
  const navigate = useNavigate()
  const { createWorkspace } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    workspaceName: '',
    companyType: '',
    teamSize: '',
    inviteEmails: ''
  })

  const companyTypes = [
    { value: 'startup', label: 'Early Stage Startup', icon: '🚀' },
    { value: 'saas', label: 'SaaS Company', icon: '💻' },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛍️' },
    { value: 'agency', label: 'Agency/Services', icon: '🎯' },
    { value: 'other', label: 'Other', icon: '🏢' }
  ]

  const teamSizes = [
    { value: '1', label: 'Just me' },
    { value: '2-5', label: '2-5 people' },
    { value: '6-10', label: '6-10 people' },
    { value: '11-25', label: '11-25 people' },
    { value: '25+', label: '25+ people' }
  ]

  const extractMessage = (error) => {
    if (!error) return 'Failed to create workspace. Please try again.'
    const detail = error.response?.data?.detail
    if (!detail) return error.message || 'Failed to create workspace. Please try again.'

    if (Array.isArray(detail)) {
      return detail.map(e => e.msg).join(', ')
    }

    if (typeof detail === 'object') {
      return detail.msg || JSON.stringify(detail)
    }

    return detail
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createWorkspace({
        name: formData.workspaceName,
        companyType: formData.companyType,
        teamSize: formData.teamSize,
        inviteEmails: formData.inviteEmails.split(',').map(email => email.trim()).filter(Boolean)
      })
      toast.success('Workspace created successfully! 🎉')
      navigate('/dashboard')
    } catch (error) {
      const message = extractMessage(error)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Create Your Workspace
            </h1>
            <p className="text-gray-600 mt-2">Set up your founder workspace and invite your team</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="workspaceName"
                  name="workspaceName"
                  value={formData.workspaceName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Startup Inc."
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Company Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {companyTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      formData.companyType === type.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white/50 hover:bg-white/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="companyType"
                      value={type.value}
                      checked={formData.companyType === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Team Size
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
                  required
                >
                  <option value="">Select team size</option>
                  {teamSizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="inviteEmails" className="block text-sm font-medium text-gray-700 mb-2">
                Invite Team Members (Optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  id="inviteEmails"
                  name="inviteEmails"
                  value={formData.inviteEmails}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                  placeholder="team@startup.com, member@startup.com"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Separate email addresses with commas</p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating workspace...
                </div>
              ) : (
                <>
                  Create Workspace
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500">
              You can always change these settings later in your workspace preferences
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default WorkspaceCreation
