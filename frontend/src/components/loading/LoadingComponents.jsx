import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    green: 'border-green-600'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`} />
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  </div>
);

export const SkeletonLoader = ({ type = 'text', lines = 1, className = '' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  if (type === 'text') {
    return (
      <div className="space-y-2">
        {[...Array(lines)].map((_, i) => (
          <div 
            key={i}
            className={`${baseClasses} h-4 ${className}`}
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className={`${baseClasses} h-10 w-10 rounded-full ${className}`} />
    );
  }

  if (type === 'card') {
    return (
      <div className={`${baseClasses} h-32 w-full ${className}`} />
    );
  }

  if (type === 'button') {
    return (
      <div className={`${baseClasses} h-10 w-24 ${className}`} />
    );
  }

  return null;
};

export const LoadingCard = ({ title }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white rounded-lg shadow-sm p-6 space-y-4"
  >
    {title && (
      <div className="flex items-center space-x-4">
        <SkeletonLoader type="avatar" />
        <div className="flex-1">
          <SkeletonLoader type="text" className="w-1/3" />
        </div>
      </div>
    )}
    <SkeletonLoader type="text" lines={3} />
  </motion.div>
);

export const TableRowSkeleton = ({ columns = 4 }) => (
  <tr>
    {[...Array(columns)].map((_, i) => (
      <td key={i} className="px-6 py-4 whitespace-nowrap">
        <SkeletonLoader type="text" />
      </td>
    ))}
  </tr>
);

export const LoadingTable = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white shadow-sm rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <tbody className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);