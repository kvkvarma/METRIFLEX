"use client"

export default function MacroProgressCards({ todayEntry, userGoals }) {
  if (!todayEntry || !userGoals) return null;

  const metrics = [
    { label: "Calories", value: todayEntry.calories, goal: userGoals.calorieGoal, unit: "kcal", color: "bg-red-500" },
    { label: "Protein", value: todayEntry.protein, goal: userGoals.proteinGoal, unit: "g", color: "bg-green-500" },
    { label: "Carbs", value: todayEntry.carbs, goal: userGoals.carbsGoal, unit: "g", color: "bg-blue-500" },
    { label: "Fats", value: todayEntry.fats, goal: userGoals.fatsGoal, unit: "g", color: "bg-orange-500" },
    { label: "Steps", value: todayEntry.steps, goal: userGoals.stepsGoal, unit: "", color: "bg-purple-500" },
    { label: "Water", value: todayEntry.water, goal: userGoals.waterGoal, unit: "ml", color: "bg-cyan-500" },
    { label: "Sleep", value: todayEntry.sleep, goal: userGoals.sleepGoal, unit: "min", color: "bg-yellow-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-80 overflow-auto">
      {metrics.map((m) => {
        const percent = Math.min((m.value / m.goal) * 100, 100);
        const remaining = Math.max(m.goal - m.value, 0);

        return (
          <div
            key={m.label}
            className="rounded-xl border p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{m.label}</h3>
              <span className="text-sm text-gray-500">
                {m.value} / {m.goal} {m.unit}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${m.color}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {remaining > 0
                ? `${remaining} ${m.unit} remaining`
                : "Goal exceeded"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
