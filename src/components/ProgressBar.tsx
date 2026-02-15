interface ProgressBarProps {
  percent: number;
  variant?: "income" | "spending";
  className?: string;
}

export default function ProgressBar({ percent, variant = "income", className = "" }: ProgressBarProps) {
  const capped = Math.min(percent, 100);
  const isOverBudget = percent > 100;
  const barColor = isOverBudget
    ? "bg-red-600 dark:bg-red-500"
    : variant === "spending"
      ? "bg-pink-400 dark:bg-pink-500"
      : "bg-emerald-500 dark:bg-emerald-400";

  return (
    <div className={`w-full flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(capped, 100)}%` }}
        />
      </div>
      <span className={`text-xs font-medium tabular-nums w-10 ${
        isOverBudget ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
      }`}>
        {Math.round(percent)}%
      </span>
    </div>
  );
}
