import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';

const StateContext = createContext();

// Define types of synchronized resources
const RESOURCE_TYPES = {
  DEAL: 'deal',
  TASK: 'task',
  CONTACT: 'contact',
  TEAM: 'team'
};

// Define update actions
const UPDATE_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  BATCH: 'batch'
};

export const StateProvider = ({ children }) => {
  const { user, workspace } = useAuth();
  const { sendMessage } = useWebSocket();
  const [syncState, setSyncState] = useState({
    deals: new Map(),
    tasks: new Map(),
    contacts: new Map(),
    team: new Map(),
    lastSync: null
  });
  
  // Handle incoming state updates
  const handleStateUpdate = useCallback((message) => {
    const { resource_type, resource_id, data, action } = message;
    
    setSyncState(prevState => {
      const newState = { ...prevState };
      const resourceMap = new Map(prevState[`${resource_type}s`]);
      
      switch (action) {
        case UPDATE_ACTIONS.CREATE:
        case UPDATE_ACTIONS.UPDATE:
          resourceMap.set(resource_id, {
            ...data,
            lastUpdated: Date.now()
          });
          break;
          
        case UPDATE_ACTIONS.DELETE:
          resourceMap.delete(resource_id);
          break;
          
        case UPDATE_ACTIONS.BATCH:
          data.forEach(item => {
            resourceMap.set(item.id, {
              ...item,
              lastUpdated: Date.now()
            });
          });
          break;
      }
      
      newState[`${resource_type}s`] = resourceMap;
      return newState;
    });
  }, []);
  
  // Handle optimistic updates
  const optimisticUpdate = useCallback((resourceType, resourceId, data, action) => {
    setSyncState(prevState => {
      const newState = { ...prevState };
      const resourceMap = new Map(prevState[`${resourceType}s`]);
      
      switch (action) {
        case UPDATE_ACTIONS.CREATE:
        case UPDATE_ACTIONS.UPDATE:
          resourceMap.set(resourceId, {
            ...data,
            lastUpdated: Date.now(),
            pending: true
          });
          break;
          
        case UPDATE_ACTIONS.DELETE:
          resourceMap.set(resourceId, {
            ...resourceMap.get(resourceId),
            deleted: true,
            pending: true
          });
          break;
      }
      
      newState[`${resourceType}s`] = resourceMap;
      return newState;
    });
  }, []);
  
  // Sync with server
  const syncWithServer = useCallback(async (resourceType) => {
    try {
      const response = await fetch(`/api/${resourceType}s/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workspace_id: workspace?.id,
          last_sync: syncState.lastSync
        })
      });
      
      const { data } = await response.json();
      
      setSyncState(prevState => ({
        ...prevState,
        [`${resourceType}s`]: new Map(data.map(item => [item.id, item])),
        lastSync: Date.now()
      }));
    } catch (error) {
      console.error(`Error syncing ${resourceType}:`, error);
    }
  }, [workspace, syncState.lastSync]);
  
  // Listen for WebSocket updates
  useEffect(() => {
    if (!workspace?.id) return;
    
    // Subscribe to resource channels
    Object.values(RESOURCE_TYPES).forEach(type => {
      sendMessage('subscribe', {
        channel: `${type}_updates`,
        workspace_id: workspace.id
      });
    });
  }, [workspace, sendMessage]);
  
  const value = {
    state: syncState,
    update: optimisticUpdate,
    sync: syncWithServer,
    RESOURCE_TYPES,
    UPDATE_ACTIONS
  };
  
  return (
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateSync = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateSync must be used within a StateProvider');
  }
  return context;
};

export default StateContext;