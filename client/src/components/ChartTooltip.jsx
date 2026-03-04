'use client';

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const chartConfig = {
  steps: {
    label: 'Steps',
    color: '#3B82F6',
  },
  caloriesburned: {
    label: 'Calories',
    color: '#F97316',
  },
};

export function ChartTooltipDefault({ dailyMacrosData }) {
  const [timeRange, setTimeRange] = useState('7');
  const chartData = useMemo(() => {
    let sliceAmount;
    if (timeRange === '7') sliceAmount = -7;
    else if (timeRange === '30') sliceAmount = -30;
    return dailyMacrosData.slice(sliceAmount).map((item) => ({
      date: item.date.split('T')[0],
      steps: item.steps,
      caloriesburned: item.caloriesburned,
    }));
  }, [dailyMacrosData, timeRange]);

  return (
    <Card className="h-full ">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              Activity Trends
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              {timeRange === 'all'
                ? 'All time performance'
                : `Last ${timeRange} days performance`}
            </p>
          </div>

          {/* Select Dropdown */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px] h-9 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors bg-white shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 shadow-lg">
              <SelectItem value="7" className="rounded-lg cursor-pointer">
                7 Days
              </SelectItem>
              <SelectItem value="30" className="rounded-lg cursor-pointer">
                30 Days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent>
        <ChartContainer config={chartConfig} className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="caloriesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                tickFormatter={(value) => {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />

              <YAxis
                yAxisId="left"
                orientation="left"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#3B82F6', fontSize: 11, fontWeight: 600 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#F97316', fontSize: 11, fontWeight: 600 }}
              />

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                  />
                }
              />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="steps"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#3B82F6',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                fill="url(#stepsGradient)"
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="caloriesburned"
                stroke="#F97316"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#F97316',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                fill="url(#caloriesGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs font-medium text-gray-600">Steps</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs font-medium text-gray-600">
              Calories Burned
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
