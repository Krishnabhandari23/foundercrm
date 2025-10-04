import { useState, useEffect } from 'react';

export const useLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem('sidebarOpen');
    return stored ? JSON.parse(stored) : true;
  });
  
  const [layoutMode, setLayoutMode] = useState(() => 
    localStorage.getItem('layoutMode') || 'default'
  );

  const [layoutDensity, setLayoutDensity] = useState(() => 
    localStorage.getItem('layoutDensity') || 'comfortable'
  );

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('layoutMode', layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    localStorage.setItem('layoutDensity', layoutDensity);
  }, [layoutDensity]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  
  const setCompactMode = () => setLayoutMode('compact');
  const setDefaultMode = () => setLayoutMode('default');
  
  const setComfortableDensity = () => setLayoutDensity('comfortable');
  const setCompactDensity = () => setLayoutDensity('compact');

  return {
    sidebarOpen,
    layoutMode,
    layoutDensity,
    toggleSidebar,
    setSidebarOpen,
    setCompactMode,
    setDefaultMode,
    setComfortableDensity,
    setCompactDensity
  };
};