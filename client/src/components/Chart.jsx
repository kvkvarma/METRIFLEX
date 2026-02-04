// "use client"
import { useState } from "react"
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  // type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

// const chartData = [
//   { date: "2024-04-01", steps: 222, caloriesburned: 150 },
//   { date: "2024-04-02", steps: 97, caloriesburned: 180 },
//   { date: "2024-04-03", steps: 167, caloriesburned: 120 },
//   { date: "2024-04-04", steps: 242, caloriesburned: 260 },
//   { date: "2024-04-05", steps: 373, caloriesburned: 290 },
//   { date: "2024-04-06", steps: 301, caloriesburned: 340 },
//   { date: "2024-04-07", steps: 245, caloriesburned: 180 },
//   { date: "2024-04-08", steps: 409, caloriesburned: 320 },
//   { date: "2024-04-09", steps: 59, caloriesburned: 110 },
//   { date: "2024-04-10", steps: 261, caloriesburned: 190 },
//   { date: "2024-04-11", steps: 327, caloriesburned: 350 },
//   { date: "2024-04-12", steps: 292, caloriesburned: 210 },
//   { date: "2024-04-13", steps: 342, caloriesburned: 380 },
//   { date: "2024-04-14", steps: 137, caloriesburned: 220 },
//   { date: "2024-04-15", steps: 120, caloriesburned: 170 },
//   { date: "2024-04-16", steps: 138, caloriesburned: 190 },
//   { date: "2024-04-17", steps: 446, caloriesburned: 360 },
//   { date: "2024-04-18", steps: 364, caloriesburned: 410 },
//   { date: "2024-04-19", steps: 243, caloriesburned: 180 },
//   { date: "2024-04-20", steps: 89, caloriesburned: 150 },
//   { date: "2024-04-21", steps: 137, caloriesburned: 200 },
//   { date: "2024-04-22", steps: 224, caloriesburned: 170 },
//   { date: "2024-04-23", steps: 138, caloriesburned: 230 },
//   { date: "2024-04-24", steps: 387, caloriesburned: 290 },
//   { date: "2024-04-25", steps: 215, caloriesburned: 250 },
//   { date: "2024-04-26", steps: 184, caloriesburned: 280 },
//   { date: "2024-04-27", steps: 256, caloriesburned: 195 },
//   { date: "2024-04-28", steps: 312, caloriesburned: 240 },
//   { date: "2024-04-29", steps: 198, caloriesburned: 310 },
//   { date: "2024-04-30", steps: 275, caloriesburned: 220 }
// ]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  steps: {
    label: "Water",
    color: "var(--chart-1)",
  },
  caloriesburned: {
    label: "Calories Burned",
    color: "var(--chart-2)",
  },
}

export function ChartAreaInteractive({details}) {

  const [timeRange, setTimeRange] = useState("30d");

  const chartData = details.map((item)=>({
    date : item.date.split('T')[0],
    steps:item.steps,
    caloriesburned : item.caloriesburned
  }))
  console.log("Chart Data : ",chartData)
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-04-30")
    let daysToSubtract = 30
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0 border-0 shadow-none">
      <CardHeader className="flex items-center gap-2 mt-0 pb-2 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-sm font-semibold text-gray-800">Activity Chart</CardTitle>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[120px] rounded-lg text-xs h-8"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d" className="rounded-lg text-xs">
              30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg text-xs">
              1 week
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillsteps" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-steps)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-steps)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillcaloriesburned" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-caloriesburned)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-caloriesburned)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="caloriesburned"
              type="natural"
              fill="url(#fillcaloriesburned)"
              stroke="var(--color-caloriesburned)"
              stackId="a"
            />
            <Area
              dataKey="steps"
              type="natural"
              fill="url(#fillsteps)"
              stroke="var(--color-steps)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ChartAreaInteractive;