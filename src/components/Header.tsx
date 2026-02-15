"use client";

import { Calendar } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

const YEARS = [2023, 2024, 2025, 2026, 2027];

interface HeaderProps {
  month: string;
  year: number;
  onMonthChange: (month: string) => void;
  onYearChange: (year: number) => void;
}

export default function Header({ month, year, onMonthChange, onYearChange }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          MONTHLY BUDGET
        </h1>
        <ThemeToggle />
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <label htmlFor="month-select" className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Select Month:
        </label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
            <select
              id="month-select"
              value={month}
              onChange={(e) => onMonthChange(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-pastel-mint/50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent appearance-none cursor-pointer transition-colors"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <select
            id="year-select"
            value={year}
            onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-pastel-mint/50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent appearance-none cursor-pointer transition-colors"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
