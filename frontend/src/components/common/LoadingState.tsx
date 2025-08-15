import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <LoadingSpinner size="lg" className="text-blue-500 mb-2" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};