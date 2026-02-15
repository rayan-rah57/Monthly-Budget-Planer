import ProgressBar from "./ProgressBar";
import { formatCurrency } from "@/lib/format";

export interface SummaryRow {
  label: string;
  budget: number;
  actual: number;
}

interface SummaryTableProps {
  title: string;
  rows: SummaryRow[];
  variant?: "income" | "spending";
}

function calcPercent(actual: number, budget: number): number {
  if (budget <= 0) return 0;
  return (actual / budget) * 100;
}

export default function SummaryTable({ title, rows, variant = "income" }: SummaryTableProps) {
  const budgetTotal = rows.reduce((s, r) => s + r.budget, 0);
  const actualTotal = rows.reduce((s, r) => s + r.actual, 0);
  const totalPercent = calcPercent(actualTotal, budgetTotal);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 p-4 border-b border-gray-100 dark:border-gray-700">
        {title}
      </h3>
      <div className="p-4 space-y-4">
        {rows.map((row) => {
          const percent = calcPercent(row.actual, row.budget);
          return (
            <div key={row.label} className="space-y-1 group">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {row.label}
                </span>
                <span className="text-gray-600 dark:text-gray-400 tabular-nums">
                  {formatCurrency(row.actual)} / {formatCurrency(row.budget)}
                </span>
              </div>
              <ProgressBar percent={percent} variant={variant} />
            </div>
          );
        })}
        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600 space-y-1">
          <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-gray-100">
            <span>Total</span>
            <span className="tabular-nums">
              {formatCurrency(actualTotal)} / {formatCurrency(budgetTotal)}
            </span>
          </div>
          <ProgressBar percent={totalPercent} variant={variant} />
        </div>
      </div>
    </div>
  );
}
