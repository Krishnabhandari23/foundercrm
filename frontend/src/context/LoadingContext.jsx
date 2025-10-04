import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingQueue, setLoadingQueue] = useState([]);

  const startLoading = (key = 'global', message = '') => {
    if (key === 'global') {
      setGlobalLoading(true);
    } else {
      setLoadingStates(prev => ({ 
        ...prev, 
        [key]: { loading: true, message } 
      }));
    }
    setLoadingQueue(prev => [...prev, key]);
  };

  const stopLoading = (key = 'global') => {
    if (key === 'global') {
      setGlobalLoading(false);
    } else {
      setLoadingStates(prev => ({
        ...prev,
        [key]: { loading: false, message: '' }
      }));
    }
    setLoadingQueue(prev => prev.filter(k => k !== key));
  };

  const isLoading = (key = 'global') => {
    if (key === 'global') return globalLoading;
    return loadingStates[key]?.loading || false;
  };

  const getLoadingMessage = (key) => {
    return loadingStates[key]?.message || '';
  };

  const value = {
    isLoading,
    startLoading,
    stopLoading,
    getLoadingMessage,
    hasActiveLoaders: loadingQueue.length > 0
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {/* Global Loading Overlay */}
      {globalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};