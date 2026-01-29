import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Target, TrendingUp } from "lucide-react";

const SmallProgressCircle = ({ percentage, achieved, total }) => {
  const RADIUS = 22;
  const STROKE = 5;
  const CIRC = 2 * Math.PI * RADIUS;
  const dash = (percentage / 100) * CIRC;

  // Dynamic color based on progress
  const getProgressColor = () => {
    if (percentage >= 75) return "#10B981"; // green
    if (percentage >= 50) return "#F59E0B"; // amber
    if (percentage >= 25) return "#3B82F6"; // blue
    return "#EF4444"; // red
  };

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg viewBox="0 0 50 50" className="-rotate-90">
        {/* Background circle with subtle shadow effect */}
        <circle
          cx="25"
          cy="25"
          r={RADIUS}
          stroke="#E5E7EB"
          strokeWidth={STROKE}
          fill="none"
          opacity="0.3"
        />

        {/* Progress circle with gradient effect */}
        <circle
          cx="25"
          cy="25"
          r={RADIUS}
          stroke={getProgressColor()}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${dash} ${CIRC}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: "drop-shadow(0 0 2px rgba(16, 185, 129, 0.3))",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-gray-800">
          {achieved}/{total}
        </span>
      </div>
    </div>
  );
};

const TodaysPlan = ({ userGoals, todayEntry }) => {
  const navigate = useNavigate();

  const goals = 4;
  let achievedGoals = 0;
  console.log("userGoals:", userGoals);
  console.log("todayEntry:", todayEntry);
  
  if (todayEntry) {
    if (todayEntry.calories >= userGoals.calorieGoal) achievedGoals++;
    if (todayEntry.protein >= userGoals.proteinGoal) achievedGoals++;
    if (todayEntry.carbs >= userGoals.carbsGoal) achievedGoals++;
    if (todayEntry.fats >= userGoals.fatsGoal) achievedGoals++;
  }

  const progressPercentage = (achievedGoals / goals) * 100;

  // Get motivational message based on progress
  const getMessage = () => {
    if (progressPercentage === 100) return "Perfect! All goals met! 🎉";
    if (progressPercentage >= 75) return "Almost there! Keep going! 💪";
    if (progressPercentage >= 50) return "Great progress today!";
    if (progressPercentage >= 25) return "Good start! Stay focused!";
    return "Let's get started today!";
  };

  return (
    <div className="flex items-center justify-between w-full gap-4 group">
      {/* Left side - Progress and Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <SmallProgressCircle
          percentage={progressPercentage}
          achieved={achievedGoals}
          total={goals}
        />

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              Today's Goals
            </h3>
          </div>
          <p className="text-xs text-gray-500 truncate">
            {getMessage()}
          </p>
        </div>
      </div>

      {/* Right side - Action Button */}
      <button
        onClick={() => navigate("/workoutsplits")}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Plan</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  );
};

export default TodaysPlan;