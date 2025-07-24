import React from 'react';

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  );
} 