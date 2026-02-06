"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import { useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A pie chart with no separator"



const chartConfig = {
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
}
export function ChartPieSeparatorNone({requestsAcceptanceRatio}) {
const pieData = useMemo(() => {
  return requestsAcceptanceRatio.map((item) => ({
    browser: item.name,       
    visitors: item.count, 
    fill:
      item.name === "Rejected Requests"
        ? "var(--chart-1)"
        : item.name === "Total Requests"
        ? "var(--chart-2)"
        : "var(--chart-3)",
  }));
}, [requestsAcceptanceRatio]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Trainer Requests and Acceptance Chart</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
              dataKey="visitors"
              nameKey="browser"
              stroke="0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center leading-none font-medium">
          Acceptance Percentage : 
        </div>
        
      </CardFooter>
    </Card>
  )
}
