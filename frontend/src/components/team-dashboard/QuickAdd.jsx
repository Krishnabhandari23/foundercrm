import React, { useState } from 'react'
import { Users, CheckSquare, FileText } from 'lucide-react'

const QuickAdd = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Quick Add</h3>
        <button onClick={() => setOpen(!open)} className="text-sm text-blue-600">New</button>
      </div>
      <div className="space-y-3">
        <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg">
          <Users className="w-5 h-5" />
          <span>Add Contact</span>
        </button>
        <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
          <CheckSquare className="w-5 h-5" />
          <span>Add Task</span>
        </button>
        <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg">
          <FileText className="w-5 h-5" />
          <span>Add Note</span>
        </button>
      </div>
    </div>
  )
}

export default QuickAdd
