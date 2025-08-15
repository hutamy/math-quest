import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="text-red-500 text-5xl mb-4"><ExclamationTriangleIcon className="h-12 w-12 text-red-600" /></div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Try Again
        </button>
      )}
    </div>
  );
};
