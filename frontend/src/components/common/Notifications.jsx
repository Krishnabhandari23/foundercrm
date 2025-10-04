import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

const Notifications = ({ notifications = [] }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [visibleNotifications, setVisibleNotifications] = React.useState([]);

  // Update visible notifications when new ones arrive
  React.useEffect(() => {
    setVisibleNotifications(notifications.slice(0, 5));
  }, [notifications]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bell className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="font-medium text-gray-900">Notifications</h3>
          {notifications.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          {expanded ? 'Show Less' : 'Show All'}
        </button>
      </div>

      <AnimatePresence>
        {visibleNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{notification.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => {
                setVisibleNotifications(prev =>
                  prev.filter(n => n.id !== notification.id)
                );
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No new notifications
        </div>
      )}
    </div>
  );
};

export default Notifications;