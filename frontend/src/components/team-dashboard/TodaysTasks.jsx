import React, { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import axios from 'axios'

const TodaysTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/dashboard/team-member/tasks')
      if (response.data.success && response.data.data.todaysTasks) {
        setTasks(response.data.data.todaysTasks)
      }
      setError(null)
    } catch (err) {
      console.error('Failed to fetch today\'s tasks:', err)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const toggle = async (id) => {
    try {
      // Update task status
      await axios.put(`http://localhost:8000/api/tasks/${id}/status`, {
        status: tasks.find(t => t.id === id)?.status === 'completed' ? 'todo' : 'completed'
      })
      // Refresh tasks
      await fetchTasks()
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-3">Today&apos;s Tasks</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-3">Today&apos;s Tasks</h3>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold mb-3">Today&apos;s Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks for today</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center justify-between">
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={task.status === 'completed'} 
                  onChange={() => toggle(task.id)}
                />
                <div>
                  <div className={`${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {task.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    Due {task.due_date ? format(parseISO(task.due_date), 'MMM d') : 'No due date'}
                  </div>
                </div>
              </label>
              <div className={`text-xs ${
                task.priority === 'urgent' ? 'text-red-500' :
                task.priority === 'high' ? 'text-orange-500' :
                task.priority === 'medium' ? 'text-blue-500' :
                'text-gray-500'
              }`}>
                {task.status === 'completed' ? 'Completed' : task.priority}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TodaysTasks
