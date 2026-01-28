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

export default function CaloriesBarChart({ dailyMacrosData}) {
    
  const [macro, setMacro] = useState("protein");

  const chartData = useMemo(() => {
    return dailyMacrosData.map((item) => ({
     day: new Date(item.date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }),
      protein: item.protein,
      carbs: item.carbs,
      fats: item.fats,
    }));
  }, [dailyMacrosData]);

//   const chartData = [
//     { day: "01 Jan", protein: 50, carbs: 100, fats: 30 },
//     { day: "02 Jan", protein: 65, carbs: 120, fats: 35 },
//     { day: "03 Jan", protein: 70, carbs: 140, fats: 40 },
//     { day: "04 Jan", protein: 44, carbs: 60, fats: 5 },
//     { day: "05 Jan", protein: 90, carbs: 180, fats: 50 },
//     { day: "06 Jan", protein: 85, carbs: 170, fats: 48 },
//     { day: "07 Jan", protein: 95, carbs: 190, fats: 55 },
//     { day: "08 Jan", protein: 10, carbs: 20, fats: 60 },
//     { day: "09 Jan", protein: 110, carbs: 220, fats: 65 },
//     { day: "10 Jan", protein: 120, carbs: 240, fats: 70 }
//   ]
  return (
    <Card className="h-full overflow-scroll">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Macros Intake</CardTitle>
        <select
          value={macro}
          onChange={(e) => setMacro(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="protein">Protein</option>
          <option value="carbs">Carbs</option>
          <option value="fats">Fats</option>
        </select>
      </CardHeader>

      <CardContent className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="day" className="text-xs" />
            <YAxis hide />
            <Tooltip />
            <Bar
              dataKey={macro}
              radius={[6, 6, 0, 0]}
              fill={macro === "protein" ? "#22c55e" : macro === "carbs" ? "#f59e0b" : "#ef4444"}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
