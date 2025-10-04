import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Target,
  TrendingUp,
  Users,
  UserPlus,
  Settings,
  Shield,
  Crown,
  Star,
  Clock,
  Activity,
  BarChart3
} from 'lucide-react'
import AddTeamMemberModal from '../components/team/AddTeamMemberModal'
import TeamMemberModal from '../components/team/TeamMemberModal'
import EditTeamMemberModal from '../components/team/EditTeamMemberModal'
import toast from 'react-hot-toast'

const Team = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Mock team data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@foundercrm.com',
      phone: '+1 (555) 123-4567',
      role: 'founder',
      department: 'Leadership',
      title: 'CEO & Founder',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      status: 'active',
      joinDate: '2023-01-01',
      location: 'San Francisco, CA',
      salary: '₹180,000',
      permissions: ['admin', 'all_access'],
      skills: ['Leadership', 'Strategy', 'Product Vision'],
      performanceScore: 95,
      tasksCompleted: 47,
      dealsWon: 12,
      hoursWorked: 168,
      lastActive: '2024-01-16T10:30:00Z'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@foundercrm.com',
      phone: '+1 (555) 234-5678',
      role: 'admin',
      department: 'Sales',
      title: 'Head of Sales',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b524?w=64&h=64&fit=crop&crop=face',
      status: 'active',
      joinDate: '2023-02-15',
      location: 'New York, NY',
      salary: '₹120,000',
      permissions: ['sales_admin', 'contacts_full', 'deals_full'],
      skills: ['Sales Strategy', 'Team Management', 'CRM'],
      performanceScore: 88,
      tasksCompleted: 34,
      dealsWon: 8,
      hoursWorked: 160,
      lastActive: '2024-01-16T09:15:00Z'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@foundercrm.com',
      phone: '+1 (555) 345-6789',
      role: 'manager',
      department: 'Engineering',
      title: 'Lead Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      status: 'active',
      joinDate: '2023-03-01',
      location: 'Austin, TX',
      salary: '₹110,000',
      permissions: ['tech_admin', 'system_access'],
      skills: ['React', 'Node.js', 'System Architecture'],
      performanceScore: 92,
      tasksCompleted: 56,
      dealsWon: 0,
      hoursWorked: 172,
      lastActive: '2024-01-16T11:45:00Z'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@foundercrm.com',
      phone: '+1 (555) 456-7890',
      role: 'employee',
      department: 'Marketing',
      title: 'Marketing Specialist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h-64&fit=crop&crop=face',
      status: 'active',
      joinDate: '2023-04-10',
      location: 'Remote',
      salary: '₹75,000',
      permissions: ['marketing_access', 'contacts_view'],
      skills: ['Digital Marketing', 'Content Creation', 'Analytics'],
      performanceScore: 85,
      tasksCompleted: 28,
      dealsWon: 3,
      hoursWorked: 155,
      lastActive: '2024-01-16T08:30:00Z'
    },
    {
      id: 5,
      name: 'David Rodriguez',
      email: 'david@foundercrm.com',
      phone: '+1 (555) 567-8901',
      role: 'employee',
      department: 'Sales',
      title: 'Sales Representative',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
      status: 'active',
      joinDate: '2023-05-20',
      location: 'Chicago, IL',
      salary: '₹65,000',
      permissions: ['sales_access', 'contacts_edit', 'deals_edit'],
      skills: ['Sales', 'Customer Relations', 'Negotiation'],
      performanceScore: 79,
      tasksCompleted: 22,
      dealsWon: 6,
      hoursWorked: 165,
      lastActive: '2024-01-15T17:20:00Z'
    },
    {
      id: 6,
      name: 'Lisa Zhang',
      email: 'lisa@foundercrm.com',
      phone: '+1 (555) 678-9012',
      role: 'employee',
      department: 'Customer Success',
      title: 'Customer Success Manager',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face',
      status: 'inactive',
      joinDate: '2023-06-01',
      location: 'Seattle, WA',
      salary: '₹70,000',
      permissions: ['support_access', 'contacts_view'],
      skills: ['Customer Support', 'Problem Solving', 'Communication'],
      performanceScore: 82,
      tasksCompleted: 31,
      dealsWon: 2,
      hoursWorked: 140,
      lastActive: '2024-01-10T14:45:00Z'
    }
  ])

  const handleAddMember = (newMember) => {
    setTeamMembers(prev => [{ ...newMember, id: Date.now() }, ...prev])
    toast.success('Team member added successfully!')
  }

  const handleViewMember = (member) => {
    setSelectedMember(member)
    setShowDetailsModal(true)
  }

  const handleEditMember = (member) => {
    setSelectedMember(member)
    setShowEditModal(true)
  }

  const handleUpdateMember = (updatedMember) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    )
    toast.success('Team member updated successfully!')
  }

  const handleDeleteMember = (memberId) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId))
    toast.success('Team member removed successfully!')
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'founder': return <Crown className="w-4 h-4 text-yellow-600" />
      case 'admin': return <Shield className="w-4 h-4 text-red-600" />
      case 'manager': return <Star className="w-4 h-4 text-blue-600" />
      case 'employee': return <Users className="w-4 h-4 text-gray-600" />
      default: return <Users className="w-4 h-4 text-gray-600" />
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

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Calculate team stats
  const teamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    averagePerformance: Math.round(teamMembers.reduce((sum, m) => sum + m.performanceScore, 0) / teamMembers.length),
    totalDeals: teamMembers.reduce((sum, m) => sum + m.dealsWon, 0)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
          <p className="text-gray-600">Manage your team members, roles, and permissions</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Team Member
        </motion.button>
      </motion.div>

      {/* Team Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-3xl font-bold text-gray-900">{teamStats.totalMembers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-3xl font-bold text-green-600">{teamStats.activeMembers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-3xl font-bold text-purple-600">{teamStats.averagePerformance}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deals Won</p>
              <p className="text-3xl font-bold text-orange-600">{teamStats.totalDeals}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="founder">Founder</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
            >
              List
            </button>
          </div>
        </div>
      </motion.div>

      {/* Team Members Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6 cursor-pointer group"
                onClick={() => handleViewMember(member)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600">{member.title}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle menu
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all duration-200"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Role and Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(member.role)}
                    <span className={`px-2 py-1 text-xs rounded-full border ${getRoleColor(member.role)}`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{member.location}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Performance</p>
                    <p className="font-semibold text-green-600">{member.performanceScore}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Tasks Done</p>
                    <p className="font-semibold text-blue-600">{member.tasksCompleted}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(member.role)}
                          <span className={`px-2 py-1 text-xs rounded-full border ${getRoleColor(member.role)}`}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${member.performanceScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{member.performanceScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewMember(member)}
                            className="text-green-600 hover:text-green-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditMember(member)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <AddTeamMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMember}
      />

      <TeamMemberModal
        member={selectedMember}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedMember(null)
        }}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
      />

      <EditTeamMemberModal
        member={selectedMember}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedMember(null)
        }}
        onSave={handleUpdateMember}
      />
    </div>
  )
}

export default Team