import React from "react";

const RADIUS = 90;
const STROKE = 12;
const CIRC = 2 * Math.PI * RADIUS;

const MacroCard = ({ todayMacros, macroGoals }) => {
  // 1️⃣ Total goal
  const totalCircle =
    macroGoals.carbs + macroGoals.fats + macroGoals.protein;

  // 2️⃣ Goal weights
  const carbsWeight = (macroGoals.carbs / totalCircle) * 100;
  const fatsWeight = (macroGoals.fats / totalCircle) * 100;
  const proteinWeight = (macroGoals.protein / totalCircle) * 100;

  // 3️⃣ Progress
  const carbsProgress =
    (todayMacros.carbs / macroGoals.carbs) * 100;
  const fatsProgress =
    (todayMacros.fats / macroGoals.fats) * 100;
  const proteinProgress =
    (todayMacros.protein / macroGoals.protein) * 100;

  // 4️⃣ Fill (cap per slice)
  const carbsFill = Math.min(
    carbsWeight * (carbsProgress / 100),
    carbsWeight
  );
  const fatsFill = Math.min(
    fatsWeight * (fatsProgress / 100),
    fatsWeight
  );
  const proteinFill = Math.min(
    proteinWeight * (proteinProgress / 100),
    proteinWeight
  );

  const totalFill = carbsFill + fatsFill + proteinFill;

  // 5️⃣ Excess / Remaining
  const diff = {
    protein: proteinProgress - 100,
    carbs: carbsProgress - 100,
    fats: fatsProgress - 100,
  };

  // 6️⃣ SVG dash
  const proteinDash = (proteinFill / 100) * CIRC;
  const carbsDash = (carbsFill / 100) * CIRC;
  const fatsDash = (fatsFill / 100) * CIRC;

  let offset = 0;

  return (
    <div className="flex items-center gap-8 bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow lg:col-span-2">
      {/* 🔵 CIRCLE */}
      <div className="relative w-44 h-44">
        <svg
          viewBox="0 0 220 220"
          className="-rotate-90 w-full h-full"
        >
          {/* Background */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            stroke="#E5E7EB"
            strokeWidth={STROKE}
            fill="none"
          />

          {/* Protein */}
          <AnimatedArc
            color="#EF4444"
            dash={proteinDash}
            offset={offset}
            label={`Protein ${proteinProgress.toFixed(1)}%`}
          />
          {(offset += proteinDash)}

          {/* Carbs */}
          <AnimatedArc
            color="#88E788"
            dash={carbsDash}
            offset={offset}
            label={`Carbs ${carbsProgress.toFixed(1)}%`}
          />
          {(offset += carbsDash)}

          {/* Fats */}
          <AnimatedArc
            color="#3B82F6"
            dash={fatsDash}
            offset={offset}
            label={`Fats ${fatsProgress.toFixed(1)}%`}
          />
        </svg>

        {/* CENTER */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-semibold">
            {Math.round(totalFill)}%
          </div>
          <span className="text-gray-500 text-sm">Total</span>
        </div>
      </div>

      {/* 📊 SIDE DATA */}
      <div className="flex flex-col justify-center gap-4 text-sm">
        <MacroRow
          label="Protein"
          color="bg-red-500"
          percent={proteinProgress}
          diff={diff.protein}
        />
        <MacroRow
          label="Carbs"
          color="bg-green-400"
          percent={carbsProgress}
          diff={diff.carbs}
        />
        <MacroRow
          label="Fats"
          color="bg-blue-500"
          percent={fatsProgress}
          diff={diff.fats}
        />
      </div>
    </div>
  );
};

/* 🔹 Animated SVG ARC */
const AnimatedArc = ({ color, dash, offset, label }) => (
  <circle
    cx="110"
    cy="110"
    r={90}
    stroke={color}
    strokeWidth={12}
    fill="none"
    strokeDasharray={`${dash} ${2 * Math.PI * 90}`}
    strokeDashoffset={-offset}
    strokeLinecap="round"
    style={{
      transition: "stroke-dasharray 0.8s ease, stroke-dashoffset 0.8s ease",
    }}
  >
    <title>{label}</title>
  </circle>
);

/* 🔹 SIDE ROW */
const MacroRow = ({ label, color, percent, diff }) => (
  <div className="flex justify-between items-center gap-6 h-12">
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-gray-500">{label}</span>
    </div>

    <div className="text-right">
      <div className="font-medium">{percent.toFixed(1)}%</div>
      {diff >= 0 ? (
        <div className="text-green-500 text-sm">
          +{diff.toFixed(1)}%
        </div>
      ) : (
        <div className="text-red-400 text-sm">
          -{Math.abs(diff).toFixed(1)}%
        </div>
      )}
    </div>
  </div>
);

export default MacroCard;
