import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Plus, 
  Download,
  Upload,
  SortAsc,
  MoreVertical,
  Mail,
  Phone,
  Building,
  User,
  Tag,
  Calendar
} from 'lucide-react'
import ContactCard from '../components/contacts/ContactCard'
import ContactTable from '../components/contacts/ContactTable'
import ContactFilters from '../components/contacts/ContactFilters'
import AddContactModal from '../components/contacts/AddContactModal'
import ContactDetailsModal from '../components/contacts/ContactDetailsModal'
import EditContactModal from '../components/contacts/EditContactModal'
import { contactsAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Contacts = () => {
  const [viewMode, setViewMode] = useState('cards') // 'cards' or 'table'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    status: 'all',
    tags: []
  })
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await contactsAPI.getContacts()
      setContacts(response.data)
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
      // Fallback to mock data
      setContacts([
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah@innovatecorp.com',
          phone: '+1 (555) 123-4567',
          company: 'InnovateCorp',
          position: 'CTO',
          type: 'potential',
          status: 'hot',
          tags: ['tech', 'b2b', 'enterprise'],
          notes: 'Interested in AI solutions for their platform',
          lastContact: '2024-01-15',
          value: 50000,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4a5?w=100&h=100&fit=crop&crop=face'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddContact = async (newContact) => {
    try {
      const response = await contactsAPI.createContact(newContact)
      const createdContact = response.data
      setContacts(prevContacts => [createdContact, ...prevContacts])
      toast.success('Contact added successfully!')
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to create contact:', error)
      toast.error('Failed to add contact')
    }
  }

  const handleEditContact = async (contactId, updatedContact) => {
    try {
      const response = await contactsAPI.updateContact(contactId, updatedContact)
      const updated = response.data
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === contactId ? updated : contact
        )
      )
      toast.success('Contact updated successfully!')
      setShowEditModal(false)
    } catch (error) {
      console.error('Failed to update contact:', error)
      toast.error('Failed to update contact')
    }
  }

  const handleDeleteContact = async (contactId) => {
    try {
      await contactsAPI.deleteContact(contactId)
      setContacts(prevContacts => 
        prevContacts.filter(contact => contact.id !== contactId)
      )
      toast.success('Contact deleted successfully!')
    } catch (error) {
      console.error('Failed to delete contact:', error)
      toast.error('Failed to delete contact')
    }
  }

  const handleToggleFavorite = (contactId) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, isFavorite: !contact.isFavorite }
          : contact
      )
    )
  }

  const handleViewContact = (contact) => {
    setSelectedContact(contact)
    setShowDetailsModal(true)
  }

  const handleEditContactFromModal = (contact) => {
    setSelectedContact(contact)
    setShowDetailsModal(false)
    setShowEditModal(true)
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedFilters.type === 'all' || contact.type === selectedFilters.type
    const matchesStatus = selectedFilters.status === 'all' || contact.status === selectedFilters.status
    const matchesTags = selectedFilters.tags.length === 0 || 
                       selectedFilters.tags.some(tag => contact.tags.includes(tag))
    
    return matchesSearch && matchesType && matchesStatus && matchesTags
  })

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'company':
        return a.company.localeCompare(b.company)
      case 'lastContact':
        return new Date(b.lastContact) - new Date(a.lastContact)
      case 'dealValue':
        return parseInt(b.dealValue.replace(/[₹,]/g, '')) - parseInt(a.dealValue.replace(/[₹,]/g, ''))
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-gray-600">
            Manage your customers, leads, partners, and investors
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="company">Sort by Company</option>
              <option value="lastContact">Sort by Last Contact</option>
              <option value="dealValue">Sort by Deal Value</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            {/* View Mode */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <ContactFilters 
              filters={selectedFilters}
              onFiltersChange={setSelectedFilters}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Contacts', value: contacts.length, icon: User, color: 'blue' },
          { label: 'Active Customers', value: contacts.filter(c => c.type === 'customer' && c.status === 'active').length, icon: Building, color: 'green' },
          { label: 'Hot Leads', value: contacts.filter(c => c.status === 'hot').length, icon: Tag, color: 'orange' },
          { label: 'This Month', value: contacts.filter(c => new Date(c.lastContact) > new Date(Date.now() - 30*24*60*60*1000)).length, icon: Calendar, color: 'purple' }
        ].map((stat, index) => (
          <div key={stat.label} className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Contacts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedContacts.map((contact, index) => (
              <ContactCard 
                key={contact.id} 
                contact={contact} 
                index={index}
                onView={handleViewContact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        ) : (
          <ContactTable contacts={sortedContacts} />
        )}
        
        {sortedContacts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedFilters.type !== 'all' || selectedFilters.status !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first contact'
              }
            </p>
            <button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </button>
          </div>
        )}
      </motion.div>

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddContact}
      />

      {/* Contact Details Modal */}
      <ContactDetailsModal
        contact={selectedContact}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedContact(null)
        }}
        onEdit={handleEditContactFromModal}
        onDelete={() => handleDeleteContact(selectedContact?.id)}
        onToggleFavorite={() => handleToggleFavorite(selectedContact?.id)}
      />

      {/* Edit Contact Modal */}
      <EditContactModal
        contact={selectedContact}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedContact(null)
        }}
        onSave={handleEditContact}
      />
    </div>
  )
}

export default Contacts