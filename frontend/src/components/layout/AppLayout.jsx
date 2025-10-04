import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../hooks/useLayout';
import { useLoading } from '../../context/LoadingContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { LoadingSpinner } from '../loading/LoadingComponents';
import ErrorBoundary from '../ErrorBoundary';

const AppLayout = () => {
  const { isAuthenticated, loading: authLoading, initialized } = useAuth();
  const { sidebarOpen, toggleSidebar, layoutMode, layoutDensity } = useLayout();
  const { hasActiveLoaders } = useLoading();
  const location = useLocation();

  // Only show loading during initial auth check
  if (authLoading && !initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Let ProtectedRoute handle the redirection
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`
      min-h-screen bg-gray-50
      ${layoutMode === 'compact' ? 'compact-mode' : ''}
      ${layoutDensity === 'compact' ? 'density-compact' : 'density-comfortable'}
    `}>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className={`
        transition-all duration-200 ease-in-out
        ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}
      `}>
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Global loading overlay */}
      <AnimatePresence>
        {hasActiveLoaders && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <LoadingSpinner size="lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;