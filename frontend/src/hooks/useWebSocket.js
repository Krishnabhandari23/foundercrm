import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const WS_RECONNECT_DELAY = 3000;
const WS_PING_INTERVAL = 30000;

// Message types for bi-directional sync
export const WS_MESSAGE_TYPES = {
  TASK_UPDATE: 'task_update',
  TASK_STATUS_CHANGE: 'task_status_change',
  DASHBOARD_SYNC: 'dashboard_sync',
  STATE_UPDATE: 'state_update',
  NOTIFICATION: 'notification',
  BEAUTIFIED_STATUS: 'beautified_status'
};

// Declare messageEmitter before usage
const messageEmitter = new EventTarget();

// Message handlers
const handleTaskUpdate = (payload) => {
  const { task, notification, beautifiedStatus } = payload;
  
  // Dispatch task update event
  window.dispatchEvent(new CustomEvent('taskUpdate', { detail: task }));
  
  // Dispatch beautified status if available
  if (beautifiedStatus) {
    window.dispatchEvent(new CustomEvent('beautifiedStatus', { 
      detail: {
        taskId: task.id,
        status: beautifiedStatus
      }
    }));
  }
  
  // Show notification if available
  if (notification) {
    window.dispatchEvent(new CustomEvent('notification', { detail: notification }));
  }
};

const handleDashboardSync = (payload) => {
  // Update dashboard data
  window.dispatchEvent(new CustomEvent('dashboardSync', { detail: payload }));
};

const handleStateUpdate = (payload) => {
  // Handle state updates
  window.dispatchEvent(new CustomEvent('stateUpdate', { detail: payload }));
};

export const useWebSocket = () => {
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const pingInterval = useRef(null);
  const messageQueue = useRef([]);
  const [connected, setConnected] = useState(false);
  const { user, workspace } = useAuth();

  // Define handleMessage after messageEmitter
  const handleMessage = (message) => {
    // Emit event for message handlers
    messageEmitter.dispatchEvent(new CustomEvent(message.type, { detail: message.payload }));

    // Handle specific message types
    switch (message.type) {
      case 'state_update':
        handleStateUpdate(message.payload);
        break;
      case 'task_update':
        handleTaskUpdate(message.payload);
        break;
      case 'dashboard_sync':
        handleDashboardSync(message.payload);
        break;
      case 'user_presence':
        handleUserPresence(message.payload);
        break;
      case 'error':
        console.error('WebSocket Error:', message.payload.message);
        break;
      default:
        console.log('Unhandled message type:', message.type);
    }
  };

  const handleUserPresence = (payload) => {
    // Implement user presence logic
    console.log('User Presence:', payload);
  };

  const connect = useCallback(() => {
    if (!user || !workspace) {
      console.log('No user or workspace, skipping WebSocket connection');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, skipping WebSocket connection');
      return;
    }

    try {
      // Create WebSocket connection
      const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsHost = import.meta.env.VITE_WS_URL || 'localhost:8000';
      const wsUrl = `${wsProtocol}://${wsHost}/ws?token=${encodeURIComponent(token)}`;

      console.log('Connecting to WebSocket:', wsUrl.replace(token, 'REDACTED'));

      if (ws.current?.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        return;
      }

      ws.current = new WebSocket(wsUrl);

      // Connection opened
      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        setConnected(true);
        
        // Process any queued messages
        while (messageQueue.current.length > 0) {
          const message = messageQueue.current.shift();
          sendMessage(message);
        }
        
        // Start ping interval
        pingInterval.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, WS_PING_INTERVAL);
      };

      // Listen for messages
      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      // Connection closed
      ws.current.onclose = () => {
        console.log('WebSocket Disconnected');
        clearInterval(pingInterval.current);
        // Attempt to reconnect
        reconnectTimeout.current = setTimeout(connect, WS_RECONNECT_DELAY);
      };

      // Connection error
      ws.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
        ws.current?.close();
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.current = null;
      pingInterval.current = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: 'ping' }));
        }
      }, WS_PING_INTERVAL);
    }
  }, [user, workspace]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    clearTimeout(reconnectTimeout.current);
    clearInterval(pingInterval.current);
  }, []);

  // Send message helper
  const sendMessage = useCallback((type, payload) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type,
        payload,
        workspace_id: workspace?.id,
        timestamp: Date.now() / 1000,
      }));
    }
  }, [workspace]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { sendMessage };
};

export default useWebSocket;
