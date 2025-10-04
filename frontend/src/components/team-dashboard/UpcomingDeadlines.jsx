import React from 'react'

const UpcomingDeadlines = () => {
  const items = [
    { id:1, title: 'Product launch', date: 'Oct 10' },
    { id:2, title: 'Investor meeting', date: 'Oct 12' },
    { id:3, title: 'Quarterly report', date: 'Oct 20' }
  ]

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold mb-3">Upcoming Deadlines</h3>
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div>
                <div className="font-medium text-gray-900">{i.title}</div>
                <div className="text-xs text-gray-500">{i.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingDeadlines
