import React from 'react'

const ProgressOverview = () => {
  const percent = 62

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold mb-3">Progress</h3>
      <div className="mb-3">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div style={{width: `${percent}%`}} className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>{percent}% tasks completed</div>
        <div>Goal: 80%</div>
      </div>
    </div>
  )
}

export default ProgressOverview
