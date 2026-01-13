import React , { useEffect, useState } from "react";

const MacroRing = ({ label, value, goal, color }) => {
  const percentage = Math.min((value / goal) * 100, 100);
  const remaining = goal - value;

  // animation state
  const [progress, setProgress] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = percentage / steps;
    const valueIncrement = value / steps;

    const interval = setInterval(() => {
      start += increment;
      setProgress(Math.min(start, percentage));
      setAnimatedValue((prev) =>
        Math.min(prev + valueIncrement, value)
      );
      if (start >= percentage) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [percentage, value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 36 36"
        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28"
      >
        {/* background ring */}
        <path
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />

        {/* progress ring */}
        <path
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${100 - progress}`}
        />

        {/* value */}
        <text
          x="18"
          y="16.5"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-black font-bold text-[5px] sm:text-[6px] lg:text-[7px]"
        >
          {Math.round(animatedValue)}
        </text>

        {/* goal */}
        <text
          x="18"
          y="22"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-gray-500 text-[3px] sm:text-[4px] lg:text-[5px]"
        >
          /{goal}g
        </text>
      </svg>

      <p className="font-semibold text-sm lg:text-base">{label}</p>

      <p className="text-xs lg:text-sm text-gray-500">
        {remaining >= 0
          ? `${remaining}g left`
          : `${Math.abs(remaining)}g over`}
      </p>
    </div>
  );
};

export default MacroRing;
