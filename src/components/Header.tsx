"use client";

import { Calendar, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
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
  const { data: session } = useSession();

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          MONTHLY BUDGET
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
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

      {session?.user && (
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 text-sm">
            {session.user.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || "User"} 
                className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pastel-mint dark:bg-emerald-800 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
            )}
            <span className="font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
              {session.user.name || session.user.email}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pastel-pink/50 dark:bg-pink-900/30 text-gray-900 dark:text-gray-100 hover:bg-pastel-pink dark:hover:bg-pink-900/50 transition-colors text-sm font-medium"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
}
