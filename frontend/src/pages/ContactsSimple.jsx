import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { contactsAPI } from '../utils/api';
import ContactForm from '../components/forms/ContactForm';
import toast from 'react-hot-toast';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactsAPI.getContacts();
      // The API returns {success: true, data: []} format
      setContacts(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (savedContact) => {
    setContacts(prev => {
      if (selectedContact) {
        // Update existing contact
        return prev.map(c => c.id === savedContact.id ? savedContact : c);
      } else {
        // Add new contact
        return [...prev, savedContact];
      }
    });
  };

  const handleDelete = async (contact) => {
    if (!window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      return;
    }

    try {
      await contactsAPI.deleteContact(contact.id);
      setContacts(prev => prev.filter(c => c.id !== contact.id));
      toast.success('Contact deleted successfully');
    } catch (error) {
      console.error('Failed to delete contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const openForm = (contact = null) => {
    setSelectedContact(contact);
    setShowForm(true);
    setShowMenu(null);
  };

  const closeForm = () => {
    setSelectedContact(null);
    setShowForm(false);
  };

  const toggleMenu = (contactId) => {
    setShowMenu(showMenu === contactId ? null : contactId);
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openForm()}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </motion.button>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 relative"
          >
            {/* Actions Menu */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => toggleMenu(contact.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              
              {showMenu === contact.id && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <button
                    onClick={() => openForm(contact)}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Contact
                  </button>
                  <button
                    onClick={() => handleDelete(contact)}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Contact
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.position} at {contact.company}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p>{contact.email}</p>
              <p>{contact.phone}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {contact.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No contacts found</p>
        </div>
      )}

      {/* Contact Form Modal */}
      {showForm && (
        <ContactForm
          contact={selectedContact}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Contacts