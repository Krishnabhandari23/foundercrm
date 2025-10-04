import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, ArrowRight, Plus } from 'lucide-react'

const PipelineOverview = () => {
  const pipelineStages = [
    {
      name: 'Lead',
      count: 8,
      value: '₹45K',
      color: 'bg-gray-500',
      deals: [
        { name: 'InnovateCorp', value: '₹15K' },
        { name: 'StartupHub', value: '₹12K' },
        { name: 'TechFlow', value: '₹8K' }
      ]
    },
    {
      name: 'Qualified',
      count: 5,
      value: '₹67K',
      color: 'bg-blue-500',
      deals: [
        { name: 'DataCorp', value: '₹25K' },
        { name: 'CloudTech', value: '₹22K' }
      ]
    },
    {
      name: 'Demo',
      count: 3,
      value: '₹89K',
      color: 'bg-purple-500',
      deals: [
        { name: 'TechCorp', value: '₹45K' },
        { name: 'SolutionCorp', value: '₹34K' }
      ]
    },
    {
      name: 'Proposal',
      count: 2,
      value: '₹112K',
      color: 'bg-orange-500',
      deals: [
        { name: 'Enterprise Plus', value: '₹75K' },
        { name: 'Scale Systems', value: '₹37K' }
      ]
    },
    {
      name: 'Closed',
      count: 4,
      value: '₹156K',
      color: 'bg-green-500',
      deals: [
        { name: 'MegaCorp', value: '₹85K' },
        { name: 'ProTech', value: '₹45K' }
      ]
    }
  ]

  const totalValue = pipelineStages.reduce((sum, stage) => {
    return sum + parseInt(stage.value.replace('₹', '').replace('K', '')) * 1000
  }, 0)

  const formatValue = (value) => {
    return `₹${(value / 1000).toFixed(0)}K`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Pipeline Overview</h3>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          View pipeline
        </button>
      </div>

      {/* Total Value */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Pipeline Value</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(totalValue)}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="space-y-4 mb-6">
        {pipelineStages.map((stage, index) => (
          <motion.div
            key={stage.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="relative"
          >
            {/* Stage Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                <h4 className="font-medium text-gray-900">{stage.name}</h4>
                <span className="text-sm text-gray-500">({stage.count})</span>
              </div>
              <span className="font-semibold text-gray-900">{stage.value}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stage.count / 8) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className={`h-2 rounded-full ${stage.color}`}
              ></motion.div>
            </div>

            {/* Top Deals */}
            {stage.deals && stage.deals.length > 0 && (
              <div className="ml-6">
                <div className="space-y-1">
                  {stage.deals.slice(0, 2).map((deal, dealIndex) => (
                    <div key={dealIndex} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{deal.name}</span>
                      <span className="font-medium text-gray-900">{deal.value}</span>
                    </div>
                  ))}
                  {stage.deals.length > 2 && (
                    <p className="text-xs text-gray-400">+{stage.deals.length - 2} more</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pipeline Funnel Visualization */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Conversion Funnel</h4>
        <div className="flex items-end justify-between space-x-1">
          {pipelineStages.map((stage, index) => {
            const height = Math.max((stage.count / 8) * 100, 10) // Minimum 10% height
            return (
              <motion.div
                key={stage.name}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className={`flex-1 ${stage.color} rounded-t-sm relative`}
                style={{ minHeight: '20px' }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs text-gray-600">{stage.count}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="flex justify-between mt-2">
          {pipelineStages.map((stage) => (
            <span key={stage.name} className="text-xs text-gray-500 flex-1 text-center">
              {stage.name}
            </span>
          ))}
        </div>
      </div>

      {/* Add Deal Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add new deal
      </motion.button>
    </motion.div>
  )
}

export default PipelineOverview