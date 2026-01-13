import React from "react";

const CIRCLE_PATH = `
  M18 3
  a 15 15 0 0 1 0 30
  a 15 15 0 0 1 0 -30
`;

const GAP = 2; // visual gap between segments

const MacroCard = ({ todayMacros, macroGoals }) => {
  // ---- Completion per macro ----
  const proteinC =
    macroGoals.protein > 0
      ? Math.min((todayMacros.protein / macroGoals.protein) * 100, 100)
      : 0;

  const carbsC =
    macroGoals.carbs > 0
      ? Math.min((todayMacros.carbs / macroGoals.carbs) * 100, 100)
      : 0;

  const fatsC =
    macroGoals.fats > 0
      ? Math.min((todayMacros.fats / macroGoals.fats) * 100, 100)
      : 0;

  // ---- Normalize ----
  const sum = proteinC + carbsC + fatsC || 1;

  const rawSegments = [
    {
      key: "protein",
      label: "Protein",
      raw: (proteinC / sum) * 100,
      display: proteinC.toFixed(1),
      color: "#3b82f6",
    },
    {
      key: "carbs",
      label: "Carbs",
      raw: (carbsC / sum) * 100,
      display: carbsC.toFixed(1),
      color: "#fb923c",
    },
    {
      key: "fats",
      label: "Fats",
      raw: (fatsC / sum) * 100,
      display: fatsC.toFixed(1),
      color: "#7c3aed",
    },
  ];

  // ---- Apply visual gap ----
  const segments = rawSegments.map((seg) => ({
    ...seg,
    percent: Math.max(seg.raw - GAP, 0),
  }));

  // ---- Overall completion ----
  const overallPercent = Math.round(
    (proteinC + carbsC + fatsC) / 3
  );

  let offset = 0;

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-xl">
      <div className="flex items-center gap-6">
        {/* ================= RING ================= */}
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            {/* Background */}
            <path
              d={CIRCLE_PATH}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="3"
            />

            {/* Segments */}
            {segments.map((seg) => {
              const dashArray = `${seg.percent} ${
                100 - seg.percent
              }`;
              const dashOffset = offset;
              offset += seg.percent + GAP;

              return (
                <path
                  key={seg.key}
                  d={CIRCLE_PATH}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="3"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              );
            })}
          </svg>

          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold">{overallPercent}%</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>

        {/* ================= LEGEND ================= */}
        <div className="flex flex-col gap-4 text-sm w-full">
          {rawSegments.map((seg) => (
            <div
              key={seg.key}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2 text-gray-500">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                {seg.label}
              </div>

              <p className="font-semibold text-black">
                {seg.display}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MacroCard;
