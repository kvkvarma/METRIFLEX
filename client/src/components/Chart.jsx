import { useState } from 'react';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

export const description = 'An interactive area chart with dual axes';

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  steps: {
    label: 'Steps',
    color: 'hsl(var(--chart-1))',
  },
  caloriesburned: {
    label: 'Calories',
    color: 'hsl(var(--chart-2))',
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

  // Calculate stats
  const totalSteps = filteredData.reduce((acc, curr) => acc + curr.steps, 0);
  const totalCalories = filteredData.reduce(
    (acc, curr) => acc + curr.caloriesburned,
    0
  );
  const avgSteps = Math.round(totalSteps / filteredData.length) || 0;
  const avgCalories = Math.round(totalCalories / filteredData.length) || 0;

  return (
    <Card className="border-0 shadow-none h-full flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-300 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-base font-bold text-gray-900">
                Activity Trends
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                Track your progress over time
              </p>
            </div>
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[110px] h-9 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors bg-white shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 shadow-lg">
              <SelectItem value="30d" className="rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">30 days</span>
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">7 days</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border-2 border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-xs font-semibold text-gray-600">Steps</p>
            </div>
            <p className="text-lg font-bold text-red-600">
              {avgSteps.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">avg/day</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border-2 border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <p className="text-xs font-semibold text-gray-600">Calories</p>
            </div>
            <p className="text-lg font-bold text-green-600">
              {avgCalories.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">avg/day</p>
          </div>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="flex-1 px-4 pb-4 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 50, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillsteps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>

              <linearGradient
                id="fillcaloriesburned"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
              opacity={0.5}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />

            {/* Left Y-axis for Steps */}
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: '#3B82F6', fontSize: 11, fontWeight: 600 }}
              tickFormatter={(value) => {
                if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                return value;
              }}
            />

            {/* Right Y-axis for Calories */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: '#A855F7', fontSize: 11, fontWeight: 600 }}
              tickFormatter={(value) => {
                if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                return value;
              }}
            />

            <ChartTooltip
              cursor={{
                stroke: '#9CA3AF',
                strokeWidth: 1,
                strokeDasharray: '5 5',
              }}
              content={
                <ChartTooltipContent
                  className="bg-white border-2 border-gray-200 shadow-xl rounded-xl"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="line"
                />
              }
            />

            <Area
              yAxisId="left"
              dataKey="steps"
              type="monotone"
              fill="url(#fillsteps)"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: '#3B82F6',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />

            <Area
              yAxisId="right"
              dataKey="caloriesburned"
              type="monotone"
              fill="url(#fillcaloriesburned)"
              stroke="#A855F7"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: '#A855F7',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />

            <ChartLegend
              content={<ChartLegendContent className="mt-4" />}
              wrapperStyle={{ paddingTop: '16px' }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ChartAreaInteractive;
