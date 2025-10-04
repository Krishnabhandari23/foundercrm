import React from 'react'

const Tasks = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Kanban Task Board</h2>
        <p className="text-gray-600">Drag-and-drop task management board will be implemented here</p>
      </div>
    </div>
  )
}

export default Tasks