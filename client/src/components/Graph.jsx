import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Tailwind-safe height map
 */
const heightMap = {
  full: "h-full",
  54: "h-54",
  64: "h-64",
  72: "h-72",
  80: "h-80",
};

export default function CaloriesBarChart({
  dailyMacrosData = [],
  cardHeight = "full",
}) {
  const [macro, setMacro] = useState("protein");

  /**
   * Transform API data → chart data
   */
  const chartData = useMemo(() => {
    return dailyMacrosData.map((item) => ({
      day: new Date(item.date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }),
      protein: item.protein ?? 0,
      carbs: item.carbs ?? 0,
      fats: item.fats ?? 0,
    }));
  }, [dailyMacrosData]);

  /**
   * Dynamic bar color
   */
  const barColor =
    macro === "protein"
      ? "#22c55e"
      : macro === "carbs"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <Card className={`${heightMap[cardHeight]} overflow-hidden flex flex-col`}>
      {/* ================= HEADER ================= */}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          Macros Intake
        </CardTitle>

        <select
          value={macro}
          onChange={(e) => setMacro(e.target.value)}
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          <option value="protein">Protein</option>
          <option value="carbs">Carbs</option>
          <option value="fats">Fats</option>
        </select>
      </CardHeader>

      {/* ================= CHART ================= */}
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip />

            <Bar
              /**
               * KEY forces remount → animation on:
               * - macro change
               * - data change
               */
              key={`${macro}-${chartData.length}`}
              dataKey={macro}
              radius={[6, 6, 0, 0]}
              fill={barColor}
              isAnimationActive
              animationBegin={0}
              animationDuration={700}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
