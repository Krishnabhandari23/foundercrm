import React from 'react'
import { X } from 'lucide-react'

const ContactFilters = ({ filters, onFiltersChange }) => {
  const contactTypes = ['all', 'customer', 'lead', 'partner', 'investor']
  const contactStatuses = ['all', 'active', 'hot', 'warm', 'cold', 'churned']
  const availableTags = [
    'high-value', 'partnership', 'technical', 'demo-requested', 
    'strategic', 'referral-source', 'series-a', 'fintech-focused',
    'former-customer', 'win-back', 'enterprise', 'security-focused'
  ]

  const handleTypeChange = (type) => {
    onFiltersChange({
      ...filters,
      type
    })
  }

  const handleStatusChange = (status) => {
    onFiltersChange({
      ...filters,
      status
    })
  }

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    
    onFiltersChange({
      ...filters,
      tags: newTags
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      type: 'all',
      status: 'all',
      tags: []
    })
  }

  const hasActiveFilters = filters.type !== 'all' || filters.status !== 'all' || filters.tags.length > 0

  return (
    <div className="space-y-4">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Active Filters</span>
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Contact Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Type
        </label>
        <div className="flex flex-wrap gap-2">
          {contactTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                filters.type === type
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Status
        </label>
        <div className="flex flex-wrap gap-2">
          {contactStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                filters.status === status
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                filters.tags.includes(tag)
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tag}
              {filters.tags.includes(tag) && (
                <X className="w-3 h-3 ml-1 inline" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Tags Summary */}
      {filters.tags.length > 0 && (
        <div>
          <div className="text-sm text-gray-600">
            Selected tags ({filters.tags.length}):
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {filters.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
              >
                {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1 hover:text-purple-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactFilters