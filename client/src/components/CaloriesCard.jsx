import { FaFire } from 'react-icons/fa';
import React from 'react';
import { useState } from 'react';

const CaloriesCard = ({ dailyMacrosData, todayEntry, userGoals }) => {
  let progress =
    todayEntry && userGoals.calorieGoal
      ? (todayEntry.calories / userGoals.calorieGoal) * 100
      : 0;

  const [progressLength, setProgressLength] = useState('1');

  if (progressLength === '7') {
    if (dailyMacrosData) {
      const last7Days = dailyMacrosData.slice(-7);
      const length = last7Days.length;
      const totalCalories = last7Days.reduce(
        (sum, entry) => sum + entry.calories,
        0
      );
      const reqCalories = userGoals.calorieGoal * length;
      console.log('Total Calories for 7 Days : ', totalCalories);
      console.log('Required Calories for 7 Days : ', reqCalories);
      progress = (totalCalories / reqCalories) * 100;
    }
  } else if (progressLength === '30') {
    if (dailyMacrosData) {
      const last30Days = dailyMacrosData.slice(-30);
      const length = last30Days.length;
      const totalCalories = last30Days.reduce(
        (sum, entry) => sum + entry.calories,
        0
      );
      const reqCalories = userGoals.calorieGoal * length;
      progress = (totalCalories / reqCalories) * 100;
    }
  }

  return (
    <div className="bg-white rounded-2xl p-2 shadow-sm flex flex-col gap-1">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Calories</h3>
        <select
          value={progressLength}
          name="progresslength"
          id="progresslength"
          className="text-sm"
          onChange={(e) => setProgressLength(e.target.value)}
        >
          <option value="1"> Today </option>
          <option value="7"> Week </option>
          <option value="30"> Month </option>
        </select>
      </div>

      {/* Gauge */}
      <div className="relative flex items-center justify-center mt-2 x">
        <svg width="220" height="120" viewBox="0 0 220 120">
          <path
            d="M20 110 A90 90 0 0 1 200 110"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Dashed inner arc */}
          <path
            d="M40 110 A70 70 0 0 1 180 110"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeDasharray="5 6"
          />

          {/* Progress arc */}

          <path
            d="M20 110 A90 90 0 0 1 200 110"
            fill="none"
            stroke="#FFAC1C"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * 282.6} 282.6`}
            style={{
              transition: 'stroke-dasharray 0.6s ease',
            }}
          />
        </svg>

        {/* Center Icon */}
        <div className="absolute top-[67%] -translate-y-1/2 bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
          <FaFire className="text-black" />
        </div>
      </div>

      {/* Percentage */}
      <div className="text-center mt-1">
        <p className="text-2xl font-semibold">{progress.toFixed(1)}%</p>
        <p className="text-sm text-gray-400 mb-5">Based on Diet</p>
      </div>
    </div>
  );
};

export default CaloriesCard;
