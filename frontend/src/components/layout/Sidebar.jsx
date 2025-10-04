import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  TrendingUp, 
  BarChart3, 
  Settings,
  X,
  Sparkles,
  Plus,
  Calendar,
  Target,
  UserCheck
} from 'lucide-react'
import AddContactModal from '../contacts/AddContactModal'
import AddTaskModal from '../dashboard/AddTaskModal'
import AddDealModal from '../dashboard/AddDealModal'
import AddMeetingModal from '../dashboard/AddMeetingModal'
import toast from 'react-hot-toast'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user } = useAuth()
  const [showContactModal, setShowContactModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showDealModal, setShowDealModal] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)

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

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Contacts', 
      href: '/contacts', 
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      name: 'Tasks', 
      href: '/tasks', 
      icon: CheckSquare,
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'Pipeline', 
      href: '/pipeline', 
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      name: 'Team', 
      href: '/team', 
      icon: UserCheck,
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: BarChart3,
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings,
      gradient: 'from-gray-500 to-gray-600'
    }
  ]

  // reduced navigation for team members (only task/contact/report focused)
  const teamNavigation = [
    {
      name: 'My Tasks',
      href: '/my-tasks',
      icon: CheckSquare,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'My Contacts',
      href: '/my-contacts',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      gradient: 'from-indigo-500 to-purple-500'
    }
  ]

  const quickActions = [
    { 
      name: 'Add Contact', 
      icon: Users, 
      color: 'text-emerald-600',
      onClick: () => setShowContactModal(true)
    },
    { 
      name: 'Create Task', 
      icon: CheckSquare, 
      color: 'text-purple-600',
      onClick: () => setShowTaskModal(true)
    },
    { 
      name: 'Schedule Meeting', 
      icon: Calendar, 
      color: 'text-blue-600',
      onClick: () => setShowMeetingModal(true)
    },
    { 
      name: 'New Deal', 
      icon: Target, 
      color: 'text-orange-600',
      onClick: () => setShowDealModal(true)
    }
  ]

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: isOpen ? 0 : -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative flex w-full max-w-xs flex-1 flex-col bg-white shadow-xl"
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent
            navigation={user && user.role === 'team' ? teamNavigation : navigation}
            quickActions={quickActions}
            location={location}
            showContactModal={showContactModal}
            setShowContactModal={setShowContactModal}
            showTaskModal={showTaskModal}
            setShowTaskModal={setShowTaskModal}
            showDealModal={showDealModal}
            setShowDealModal={setShowDealModal}
            showMeetingModal={showMeetingModal}
            setShowMeetingModal={setShowMeetingModal}
          />
        </motion.div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <SidebarContent
            navigation={user && user.role === 'team' ? teamNavigation : navigation}
            quickActions={quickActions}
            location={location}
            showContactModal={showContactModal}
            setShowContactModal={setShowContactModal}
            showTaskModal={showTaskModal}
            setShowTaskModal={setShowTaskModal}
            showDealModal={showDealModal}
            setShowDealModal={setShowDealModal}
            showMeetingModal={showMeetingModal}
            setShowMeetingModal={setShowMeetingModal}
          />
        </div>
      </div>
    </>
  )
}

const SidebarContent = ({ navigation, quickActions, location,
  showContactModal, setShowContactModal,
  showTaskModal, setShowTaskModal,
  showDealModal, setShowDealModal,
  showMeetingModal, setShowMeetingModal
}) => {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex items-center space-x-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              FounderCRM
            </h1>
            <p className="text-xs text-gray-500">Task Management</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide mb-2">
              Main Menu
            </div>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href
                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={`h-5 w-5 shrink-0 transition-colors ${
                              isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                            }`}
                          />
                          {item.name}
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="ml-auto h-2 w-2 bg-white rounded-full"
                              initial={false}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.li>
                )
              })}
            </ul>
          </li>

          {/* Quick Actions */}
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide mb-3">
              Quick Actions
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.onClick}
                  className="flex flex-col items-center p-3 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <action.icon className={`h-5 w-5 ${action.color} mb-1`} />
                  <span className="text-gray-700 font-medium">{action.name}</span>
                </motion.button>
              ))}
            </div>
          </li>

          {/* Upgrade Card */}
          <li className="mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
              <div className="relative">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Pro Plan</p>
                    <p className="text-xs text-gray-600">Current plan</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Unlock advanced analytics and unlimited team members
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Upgrade Now
                </motion.button>
              </div>
            </motion.div>
          </li>
        </ul>
      </nav>

      {/* Modal Components */}
      {showContactModal && (
        <AddContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {showTaskModal && (
        <AddTaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {showDealModal && (
        <AddDealModal
          isOpen={showDealModal}
          onClose={() => setShowDealModal(false)}
        />
      )}

      {showMeetingModal && (
        <AddMeetingModal
          isOpen={showMeetingModal}
          onClose={() => setShowMeetingModal(false)}
        />
      )}
    </>
  )
}

export default Sidebar