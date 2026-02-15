"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export interface DonutChartDataItem {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  title: string;
  data: DonutChartDataItem[];
  centerValue: string;
  colorScheme?: "income" | "spending";
}

const INCOME_COLORS = ["#5eead4", "#2dd4bf", "#14b8a6", "#0d9488"]; // teal shades
const SPENDING_COLORS = ["#fda4af", "#fb7185", "#f9a8d4", "#f472b6"]; // coral/pink tones
const DEFAULT_COLORS = ["#93c5fd", "#c4b5fd", "#fcd34d", "#86efac"];

export default function DonutChart({
  title,
  data,
  centerValue,
  colorScheme,
}: DonutChartProps) {
  const palette =
    colorScheme === "income"
      ? INCOME_COLORS
      : colorScheme === "spending"
        ? SPENDING_COLORS
        : DEFAULT_COLORS;
  const chartData = data.map((item, i) => ({
    ...item,
    color: item.color ?? palette[i % palette.length],
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 w-full transition-shadow duration-200 hover:shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
      <div className="relative w-full aspect-square min-h-[200px] max-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="75%"
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              formatter={(value) => (
                <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-bold text-gray-900 dark:text-gray-100 text-lg sm:text-xl">
            {centerValue}
          </span>
        </div>
      </div>
    </div>
  );
}
