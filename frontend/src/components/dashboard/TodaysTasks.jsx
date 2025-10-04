import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, Plus, Filter } from 'lucide-react'
import AddTaskModal from './AddTaskModal'
import { dashboardAPI, tasksAPI } from '../../utils/api'
import toast from 'react-hot-toast'

const TodaysTasks = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;
    fetchTodaysTasks();
    return () => { isMounted = false; };
  }, []);

  const fetchTodaysTasks = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getTodaysTasks();
      if (!response?.data?.todaysTasks) {
        console.warn('Invalid response format:', response);
        setTasks([]);
        return;
      }

      setTasks(response.data.todaysTasks);
    } catch (error) {
      console.error("Failed to fetch today's tasks:", error);
      toast.error("Failed to fetch today's tasks. Please try again later.");
      // Set empty tasks list on error
      setTasks([
        {
          id: 1,
          title: 'Follow up with Sarah Johnson',
          description: 'Discuss partnership opportunities',
          priority: 'high',
          completed: false,
          dueTime: '10:00 AM',
          contactName: 'Sarah Johnson',
          contactCompany: 'InnovateCorp',
        },
        {
          id: 2,
          title: 'Review pitch deck',
          description: 'Prepare for investor meeting',
          priority: 'high',
          completed: true,
          dueTime: '9:00 AM',
          contactName: null,
          contactCompany: null,
        },
        {
          id: 3,
          title: 'Send proposal to TechCorp',
          description: 'Custom software development proposal',
          priority: 'medium',
          completed: false,
          dueTime: '2:00 PM',
          contactName: 'Mike Chen',
          contactCompany: 'TechCorp',
        },
        {
          id: 4,
          title: 'Update CRM data',
          description: 'Import new leads from conference',
          priority: 'low',
          completed: false,
          dueTime: '4:00 PM',
          contactName: null,
          contactCompany: null,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (newTask) => {
    try {
      const response = await tasksAPI.createTask(newTask)
      const createdTask = response.data
      setTasks((prevTasks) => [createdTask, ...prevTasks])
      toast.success('Task created successfully!')
    } catch (error) {
      console.error('Failed to create task:', error)
      toast.error('Failed to create task')
    }
  }

  const toggleTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      await tasksAPI.updateTask(taskId, { completed: !task.completed })
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      )
      toast.success(
        task.completed ? 'Task marked as incomplete' : 'Task completed!'
      )
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Failed to update task')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const completedTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task.completed).length
    : 0
  const totalTasks = Array.isArray(tasks) ? tasks.length : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
          <p className="text-sm text-gray-600">
            {completedTasks} of {totalTasks} completed
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {totalTasks === 0
              ? 0
              : Math.round((completedTasks / totalTasks) * 100)}
            %
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: totalTasks === 0 ? '0%' : `${(completedTasks / totalTasks) * 100}%`,
            }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          ></motion.div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {Array.isArray(tasks) &&
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`p-4 border rounded-lg transition-all duration-200 ${
                task.completed
                  ? 'bg-gray-50 border-gray-200 opacity-75'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={`font-medium ${
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <p
                    className={`text-sm mb-2 ${
                      task.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {task.dueTime}
                    </div>

                    {task.contactName && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">{task.contactName}</span>
                        {task.contactCompany && (
                          <span className="text-gray-400"> • {task.contactCompany}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
      />
    </motion.div>
  )
}

export default TodaysTasks
