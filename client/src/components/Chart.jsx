// "use client"
import { useState } from 'react';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const description = 'An interactive area chart';

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  steps: {
    label: 'Steps',
    color: 'var(--chart-1)',
  },
  caloriesburned: {
    label: 'Calories Burned',
    color: 'var(--chart-2)',
  },
};

export function ChartAreaInteractive({ details }) {
  const [timeRange, setTimeRange] = useState('30d');

  const chartData = details.map((item) => ({
    date: item.date.split('T')[0],
    steps: item.steps,
    caloriesburned: item.caloriesburned,
  }));

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date('2024-04-30');

    let daysToSubtract = 30;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return date >= startDate;
  });

  return (
    <Card className="pt-0 border-0 shadow-none">
      <CardHeader className="flex items-center gap-2 mt-0 pb-2 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-sm font-semibold text-gray-800">
            Activity Chart
          </CardTitle>
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

              <linearGradient
                id="fillcaloriesburned"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
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
            />

            <Area
              dataKey="steps"
              type="natural"
              fill="url(#fillsteps)"
              stroke="var(--color-steps)"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ChartAreaInteractive;
