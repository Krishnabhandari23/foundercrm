import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const data = [
  { name: 'Mon', completed: 5 },
  { name: 'Tue', completed: 8 },
  { name: 'Wed', completed: 6 },
  { name: 'Thu', completed: 10 },
  { name: 'Fri', completed: 7 },
  { name: 'Sat', completed: 3 },
  { name: 'Sun', completed: 4 }
]

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">Task Completion (This Week)</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#7c3aed" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Summary</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <div>Contacts interacted (this week)</div>
              <div className="font-medium text-gray-900">12</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Deals assigned</div>
              <div className="font-medium text-gray-900">3</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Avg response time</div>
              <div className="font-medium text-gray-900">4h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports