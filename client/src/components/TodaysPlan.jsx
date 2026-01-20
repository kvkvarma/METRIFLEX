import React from "react";
import { useNavigate } from "react-router-dom";

const SmallProgressCircle = ({ percentage, achieved, total }) => {
  const RADIUS = 18;
  const STROKE = 4;
  const CIRC = 2 * Math.PI * RADIUS;
  const dash = (percentage / 100) * CIRC;

  return (
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 50 50" className="-rotate-90">
        {/* background */}
        <circle
          cx="25"
          cy="25"
          r={RADIUS}
          stroke="#E5E7EB"
          strokeWidth={STROKE}
          fill="none"
        />

        {/* progress */}
        <circle
          cx="25"
          cy="25"
          r={RADIUS}
          stroke="#16A34A"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${dash} ${CIRC}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 0.6s ease",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold">
        {achieved}/{total}
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

  return (
    <div className="flex items-center gap-4">
      <SmallProgressCircle
        percentage={progressPercentage}
        achieved={achievedGoals}
        total={goals}
      />

      <button
        onClick={() => navigate("/workoutsplits")}
        className="bg-green-800 text-white px-4 py-1 rounded"
      >
        Add Plan
      </button>
    </div>
  );
};

export default TodaysPlan;
