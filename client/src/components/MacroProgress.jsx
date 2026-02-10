import { Clock } from "lucide-react";
import React from "react";

const MacroCircle = ({ label, consumed, goal, color }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(100 - percentage, 0);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="-rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r={radius}
            strokeWidth="10"
            className="fill-none stroke-gray-200"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            strokeWidth="10"
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (percentage / 100) * circumference
            }
            className="fill-none transition-all duration-700"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">
            {Math.round(percentage)}%
          </span>
          <span className="text-sm text-gray-600">{label}</span>
        </div>
      </div>

      {/* Remaining */}
      <p className="mt-2 text-sm text-gray-500">
        {Math.round(remaining)}% remaining
      </p>
    </div>
  );
};

const MacroProgress = ({ today, goal }) => {
    console.log("Today Macos : ",today);
    console.log("Goal Macos : ",goal);

  return (
    <div className="flex justify-center gap-8 mt-6">
      <MacroCircle
        label="Protein"
        consumed={today?.protein}
        goal={goal?.protein}
        color="#22c55e"
      />
      <MacroCircle
        label="Carbs"
        consumed={today?.carbs}
        goal={goal?.carbs}
        color="#3b82f6"
      />
      <MacroCircle
        label="Fat"
        consumed={today?.fat}
        goal={goal?.fat}
        color="#f97316"
      />
    </div>
  );
};

export default MacroProgress;
