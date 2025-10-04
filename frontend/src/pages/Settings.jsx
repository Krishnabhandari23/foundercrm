import React from 'react'

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Workspace Settings</h2>
        <p className="text-gray-600">User and workspace configuration options will be available here</p>
      </div>
    </div>
  )
}

export default Settings