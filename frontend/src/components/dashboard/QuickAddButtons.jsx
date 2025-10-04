import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, CheckSquare, Calendar, Target, Plus, FileText, Phone, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AddContactModal from '../contacts/AddContactModal'
import AddTaskModal from './AddTaskModal'
import AddDealModal from './AddDealModal'
import AddMeetingModal from './AddMeetingModal'
import AddNoteModal from './AddNoteModal'
import toast from 'react-hot-toast'

const QuickAddButtons = () => {
  const navigate = useNavigate()
  const [showContactModal, setShowContactModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showDealModal, setShowDealModal] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)

  const handleAddContact = (contact) => {
    // In a real app, this would save to a global state or API
    console.log('New contact:', contact)
    toast.success('Contact added successfully!')
  }

  const handleAddTask = (task) => {
    // In a real app, this would save to a global state or API
    console.log('New task:', task)
    toast.success('Task created successfully!')
  }

  const handleAddDeal = (deal) => {
    // In a real app, this would save to a global state or API
    console.log('New deal:', deal)
    toast.success('Deal created successfully!')
  }

  const handleAddMeeting = (meeting) => {
    // In a real app, this would save to a global state or API
    console.log('New meeting:', meeting)
    toast.success('Meeting scheduled successfully!')
  }

  const handleAddNote = (note) => {
    // In a real app, this would save to a global state or API
    console.log('New note:', note)
    toast.success('Note saved successfully!')
  }

  const quickActions = [
    {
      name: 'Add Contact',
      description: 'Create a new contact',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      onClick: () => setShowContactModal(true)
    },
    {
      name: 'Create Task',
      description: 'Add a new task',
      icon: CheckSquare,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      onClick: () => setShowTaskModal(true)
    },
    {
      name: 'Schedule Meeting',
      description: 'Book a new meeting',
      icon: Calendar,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      onClick: () => setShowMeetingModal(true)
    },
    {
      name: 'New Deal',
      description: 'Create a deal',
      icon: Target,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      onClick: () => setShowDealModal(true)
    },
    {
      name: 'Add Note',
      description: 'Quick note or memo',
      icon: FileText,
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-200',
      onClick: () => setShowNoteModal(true)
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          Customize
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={`relative overflow-hidden p-4 bg-gradient-to-br ${action.bgGradient} border ${action.borderColor} rounded-lg hover:shadow-md transition-all duration-200 text-left group cursor-pointer`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            </div>
            
            <div className="relative">
              <div className={`inline-flex p-2 bg-gradient-to-r ${action.gradient} rounded-lg mb-3 shadow-sm`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{action.name}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Modals */}
      <AddContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSubmit={handleAddContact}
      />
      
      <AddTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleAddTask}
      />

      <AddDealModal
        isOpen={showDealModal}
        onClose={() => setShowDealModal(false)}
        onSubmit={handleAddDeal}
      />

      <AddMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSubmit={handleAddMeeting}
      />

      <AddNoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSubmit={handleAddNote}
      />
    </motion.div>
  )
}

export default QuickAddButtons