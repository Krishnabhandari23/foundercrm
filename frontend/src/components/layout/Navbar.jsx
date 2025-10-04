import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Bell, 
  Menu, 
  Plus,
  MessageCircle,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Users,
  Target,
  Calendar,
  FileText,
  CheckSquare
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AddContactModal from '../contacts/AddContactModal'
import AddTaskModal from '../dashboard/AddTaskModal'
import AddDealModal from '../dashboard/AddDealModal'
import AddMeetingModal from '../dashboard/AddMeetingModal'
import AddNoteModal from '../dashboard/AddNoteModal'
import toast from 'react-hot-toast'

const Navbar = ({ onMenuClick }) => {
  const { user, workspace, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showDealModal, setShowDealModal] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAddContact = (contact) => {
    console.log('New contact:', contact)
    toast.success('Contact added successfully!')
  }

  const handleAddTask = (task) => {
    console.log('New task:', task)
    toast.success('Task created successfully!')
  }

  const handleAddDeal = (deal) => {
    console.log('New deal:', deal)
    toast.success('Deal created successfully!')
  }

  const handleAddMeeting = (meeting) => {
    console.log('New meeting:', meeting)
    toast.success('Meeting scheduled successfully!')
  }

  const handleAddNote = (note) => {
    console.log('New note:', note)
    toast.success('Note saved successfully!')
  }

  const notifications = [
    {
      id: 1,
      type: 'task',
      title: 'New task assigned',
      message: 'Follow up with lead from yesterday',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'deal',
      title: 'Deal moved to Proposal',
      message: 'TechCorp deal advanced to proposal stage',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'contact',
      title: 'New contact added',
      message: 'Sarah Johnson from InnovateCorp',
      time: '3 hours ago',
      unread: false
    }
  ]

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="text-gray-500 hover:text-gray-900 lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="relative ml-4 flex-1 max-w-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search contacts, tasks, deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <div className="p-3 text-sm text-gray-500">
                  Search results for &quot;{searchQuery}&quot; would appear here
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Quick Add button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-1" />
              Quick Add
              <ChevronDown className="h-4 w-4 ml-1" />
            </motion.button>

            {/* Quick Add Dropdown */}
            {showQuickAdd && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                onMouseLeave={() => setShowQuickAdd(false)}
              >
                <button
                  onClick={() => {
                    setShowContactModal(true)
                    setShowQuickAdd(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-medium">Add Contact</div>
                    <div className="text-xs text-gray-500">Create new contact</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowTaskModal(true)
                    setShowQuickAdd(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <CheckSquare className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-medium">Create Task</div>
                    <div className="text-xs text-gray-500">Add new task</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowDealModal(true)
                    setShowQuickAdd(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Target className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="font-medium">New Deal</div>
                    <div className="text-xs text-gray-500">Create deal</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowMeetingModal(true)
                    setShowQuickAdd(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Schedule Meeting</div>
                    <div className="text-xs text-gray-500">Book meeting</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowNoteModal(true)
                    setShowQuickAdd(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="font-medium">Add Note</div>
                    <div className="text-xs text-gray-500">Quick note</div>
                  </div>
                </button>
              </motion.div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-6 w-6" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                          notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 text-sm font-medium text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={user?.avatar}
                alt={user?.name}
              />
              <span className="hidden md:block">{user?.name}</span>
              <ChevronDown className="h-4 w-4 hidden md:block" />
            </button>

            {/* Profile dropdown menu */}
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user?.avatar}
                      alt={user?.name}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  {workspace && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Workspace</p>
                      <p className="text-sm font-medium text-gray-900">{workspace.name}</p>
                    </div>
                  )}
                </div>
                
                <div className="p-2">
                  <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <User className="h-4 w-4 mr-3" />
                    Profile Settings
                  </button>
                  <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="h-4 w-4 mr-3" />
                    Workspace Settings
                  </button>
                  <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Help & Support
                  </button>
                  
                  <hr className="my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
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
    </div>
  )
}

export default Navbar