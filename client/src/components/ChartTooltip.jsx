"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,

} from "@/components/ui/chart"
import { useMemo } from "react"

export const description = "A stacked bar chart with a legend"
export const iframeHeight = "600px"
export const containerClassName =
  "[&>div]:w-full [&>div]:max-w-md flex items-center justify-center min-h-svh"

// const chartData = [
//   { date: "2024-07-15", running: 450, swimming: 300 },
//   { date: "2024-07-16", running: 380, swimming: 420 },
//   { date: "2024-07-17", running: 520, swimming: 120 },
//   { date: "2024-07-18", running: 140, swimming: 550 },
//   { date: "2024-07-19", running: 600, swimming: 350 },
//   { date: "2024-07-20", running: 480, swimming: 400 },
// ]

const chartConfig = {
  steps: {
    label: "Steps",
    color: "blue",
  },
  caloriesburned: {
    label: "Calories Burned",
    color: "lightblue",
  },
} 

export function ChartTooltipDefault({dailyMacrosData}) {
    console.log(dailyMacrosData)
    const chartData = useMemo(()=>{
        return dailyMacrosData.map((item)=>({
        date: item.date.split('T')[0],
        steps : item.steps,
        caloriesburned : item.caloriesburned
    }))
    },[dailyMacrosData])
   
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tooltip - Default</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }}
            />
            <Bar
              dataKey="steps"
              stackId="a"
              fill="#CC561E"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="caloriesburned"
              stackId="a"
              fill="#F6CE71"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
