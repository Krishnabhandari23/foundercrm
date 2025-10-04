export const formatCurrency = (amount) => {
  if (typeof amount === 'string') {
    amount = parseInt(amount.replace(/[₹,]/g, ''))
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

export const generateInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    hot: 'bg-red-100 text-red-800 border-red-200',
    warm: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cold: 'bg-blue-100 text-blue-800 border-blue-200',
    churned: 'bg-gray-100 text-gray-800 border-gray-200',
    pending: 'bg-orange-100 text-orange-800 border-orange-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colors[status] || colors.pending
}

export const getTypeColor = (type) => {
  const colors = {
    customer: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    lead: 'bg-blue-100 text-blue-800 border-blue-200',
    partner: 'bg-purple-100 text-purple-800 border-purple-200',
    investor: 'bg-orange-100 text-orange-800 border-orange-200',
    task: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    meeting: 'bg-pink-100 text-pink-800 border-pink-200'
  }
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export const getPriorityColor = (priority) => {
  const colors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  }
  return colors[priority] || colors.medium
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^[+]?[1-9][\d]{0,15}$/
  return re.test(phone.replace(/[\s\-()]/g, ''))
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    let aVal = a[key]
    let bVal = b[key]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

export const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key]
      const itemValue = item[key]
      
      if (!filterValue || filterValue === 'all') return true
      if (Array.isArray(filterValue)) {
        return filterValue.length === 0 || filterValue.includes(itemValue)
      }
      
      return itemValue === filterValue
    })
  })
}