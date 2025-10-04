import { useState, useCallback } from 'react';
import { useLoading } from '../../context/LoadingContext';

export const useOptimisticUpdate = (updateFn, options = {}) => {
  const [optimisticData, setOptimisticData] = useState(null);
  const { startLoading, stopLoading } = useLoading();
  const { loadingKey, onSuccess, onError, revertOnError = true } = options;

  const execute = useCallback(async (data, optimisticValue) => {
    const originalData = data;
    
    try {
      if (loadingKey) {
        startLoading(loadingKey);
      }

      // Apply optimistic update
      if (optimisticValue) {
        setOptimisticData(optimisticValue);
      }

      // Perform actual update
      const result = await updateFn(data);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      console.error('Optimistic update failed:', error);
      
      // Revert optimistic update if needed
      if (revertOnError) {
        setOptimisticData(originalData);
      }

      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      if (loadingKey) {
        stopLoading(loadingKey);
      }
    }
  }, [updateFn, loadingKey, onSuccess, onError, revertOnError, startLoading, stopLoading]);

  return {
    execute,
    optimisticData,
    setOptimisticData
  };
};

export const useOptimisticList = (initialItems = []) => {
  const [items, setItems] = useState(initialItems);

  const addItem = useCallback((newItem) => {
    setItems(current => [...current, { ...newItem, optimistic: true }]);
  }, []);

  const updateItem = useCallback((id, updates) => {
    setItems(current => 
      current.map(item => 
        item.id === id ? { ...item, ...updates, optimistic: true } : item
      )
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);

  const confirmItem = useCallback((id) => {
    setItems(current => 
      current.map(item => 
        item.id === id ? { ...item, optimistic: false } : item
      )
    );
  }, []);

  const revertItem = useCallback((id, originalItem) => {
    setItems(current => 
      current.map(item => 
        item.id === id ? originalItem : item
      )
    );
  }, []);

  return {
    items,
    setItems,
    addItem,
    updateItem,
    removeItem,
    confirmItem,
    revertItem
  };
};