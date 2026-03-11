import React from 'react';
import { Dumbbell } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="relative">
        {/* Pulsing background */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full animate-ping"></div> */}
        </div>

        {/* Dumbbell animation */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-bounce">
            <div className="animate-spin-slow">
              <Dumbbell className="w-15 h-15  text-red-600" strokeWidth={2.5} />
            </div>
          </div>

          {/* Loading text */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-bold text-gray-900">Loading</p>

            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
