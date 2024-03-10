import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

export const SkeletonMessage = () => {
  return (
    <div className="grid grid-cols-[30px_1fr] gap-5 p-5 animate-pulse">
      <div>
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-sm shadow-md shadow-blue-500/50 bg-blue-500">
          {/* You can use a placeholder icon or loading animation here */}
          <div className="bg-blue-200 h-6 w-6 rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="bg-gray-300 h-5 w-4/5 mb-2"></div>
        <div className="text-sm text-gray-500 mt-4">
          <div className="bg-gray-300 h-3 w-1/2 mb-2"></div>
          <div className="text-right">
            <div className="flex items-center">
              <div className="bg-blue-200 h-4 w-4 mr-2"></div>
              <div className="bg-slate-400 h-4 w-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};