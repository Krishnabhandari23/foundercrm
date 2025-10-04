import { format } from 'date-fns';

// Status display mappings
const STATUS_DISPLAY = {
  TODO: '📋 To Do',
  IN_PROGRESS: '🔄 In Progress',
  COMPLETED: '✅ Completed',
  BLOCKED: '🚫 Blocked',
  ON_HOLD: '⏸️ On Hold'
};

// Priority display mappings
const PRIORITY_DISPLAY = {
  LOW: '🔽 Low Priority',
  MEDIUM: '➡️ Medium Priority',
  HIGH: '🔼 High Priority',
  URGENT: '⚠️ Urgent'
};

/**
 * Creates a beautified status message for task updates
 */
export const createBeautifiedStatusMessage = (task, previousStatus = null) => {
  const {
    title,
    status,
    priority,
    due_date,
    assigned_to,
    completed_at,
    last_status_update
  } = task;

  let message = '';

  // Status change message
  if (previousStatus && previousStatus !== status) {
    message += `Task "${title}" moved from ${STATUS_DISPLAY[previousStatus]} to ${STATUS_DISPLAY[status]}\n`;
  } else {
    message += `Task "${title}" is ${STATUS_DISPLAY[status]}\n`;
  }

  // Add priority if it exists
  if (priority) {
    message += `${PRIORITY_DISPLAY[priority]} | `;
  }

  // Add due date if it exists
  if (due_date) {
    message += `Due: ${format(new Date(due_date), 'PPP')} | `;
  }

  // Add completion info if task is completed
  if (status === 'COMPLETED' && completed_at) {
    message += `✨ Completed on ${format(new Date(completed_at), 'PPP')}`;
  }

  // Add last update time
  if (last_status_update) {
    message += `\nLast updated: ${format(new Date(last_status_update), 'PPp')}`;
  }

  return message.trim();
};

/**
 * Formats task updates for dashboard display
 */
export const formatTaskUpdate = (task, type = 'update') => {
  const baseUpdate = {
    id: Date.now(),
    taskId: task.id,
    timestamp: new Date().toISOString(),
    type
  };

  switch (type) {
    case 'status_change':
      return {
        ...baseUpdate,
        title: 'Task Status Updated',
        message: createBeautifiedStatusMessage(task),
        status: task.status,
        priority: task.priority
      };
      
    case 'completion':
      return {
        ...baseUpdate,
        title: 'Task Completed',
        message: `🎉 Task "${task.title}" has been completed!`,
        completedAt: task.completed_at
      };
      
    case 'assignment':
      return {
        ...baseUpdate,
        title: 'Task Assigned',
        message: `Task "${task.title}" has been assigned to ${task.assigned_to_name}`,
        assignedTo: task.assigned_to
      };
      
    default:
      return {
        ...baseUpdate,
        title: 'Task Updated',
        message: `Task "${task.title}" has been updated`,
        changes: task.changes || []
      };
  }
};

/**
 * Creates a notification object for task updates
 */
export const createTaskNotification = (task, type = 'update') => {
  const update = formatTaskUpdate(task, type);
  
  return {
    id: update.id,
    title: update.title,
    message: update.message,
    type: 'task_update',
    timestamp: update.timestamp,
    taskId: task.id,
    priority: task.priority,
    status: task.status
  };
};