"use client";

import { CheckSquare, Square } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export interface TableRow {
  id: string;
  label: string;
  due?: string;
  budget: string;
  actual: string;
  checked?: boolean;
  transactionId?: string;
  type?: "BILL" | "DEBT" | "SAVING";
}

interface DataTableProps {
  title: string;
  rows: TableRow[];
  columns: ("due" | "budget" | "actual")[];
  showCheckbox?: boolean;
  onCheckChange?: (row: TableRow, checked: boolean) => void;
}

export default function DataTable({
  title,
  rows,
  columns,
  showCheckbox = true,
  onCheckChange,
}: DataTableProps) {
  const budgetTotal = rows.reduce(
    (sum, r) => sum + parseFloat(r.budget.replace(/,/g, "")),
    0
  );
  const actualTotal = rows.reduce(
    (sum, r) => sum + parseFloat(r.actual.replace(/,/g, "")),
    0
  );

  const handleCheck = (row: TableRow) => {
    if (!onCheckChange || row.checked) return;
    onCheckChange(row, true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 p-4 border-b border-gray-100 dark:border-gray-700">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-pastel-mint/30 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
              {showCheckbox && (
                <th className="px-4 py-2.5 text-left w-8"></th>
              )}
              <th className="px-4 py-2.5 text-left font-medium">Item</th>
              {columns.includes("due") && (
                <th className="px-4 py-2.5 text-left font-medium">Due</th>
              )}
              <th className="px-4 py-2.5 text-right font-medium">Budget</th>
              <th className="px-4 py-2.5 text-right font-medium">Actual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`border-t border-gray-50 dark:border-gray-700/50 transition-colors duration-150 hover:bg-pastel-pink/20 dark:hover:bg-gray-700/30 ${
                  row.checked ? "bg-pastel-mint/10 dark:bg-emerald-900/20" : ""
                }`}
              >
                {showCheckbox && (
                  <td className="px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => handleCheck(row)}
                      className="focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-0.5"
                      aria-label={row.checked ? "Paid" : "Mark as paid"}
                    >
                      {row.checked ? (
                        <CheckSquare className="h-5 w-5 text-emerald-500 fill-current cursor-default" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors" />
                      )}
                    </button>
                  </td>
                )}
                <td
                  className={`px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200 ${
                    row.checked ? "line-through text-gray-500 dark:text-gray-400" : ""
                  }`}
                >
                  {row.label}
                </td>
                {columns.includes("due") && (
                  <td
                    className={`px-4 py-2.5 text-gray-600 dark:text-gray-400 ${
                      row.checked ? "line-through" : ""
                    }`}
                  >
                    {row.due ?? ""}
                  </td>
                )}
                <td
                  className={`px-4 py-2.5 text-right tabular-nums ${
                    row.checked ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {formatCurrency(row.budget)}
                </td>
                <td
                  className={`px-4 py-2.5 text-right tabular-nums ${
                    row.checked ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {formatCurrency(row.actual)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-pastel-yellow/50 dark:bg-amber-900/20 font-semibold text-gray-900 dark:text-gray-100 border-t-2 border-gray-200 dark:border-gray-600">
              {showCheckbox && <td className="px-4 py-3"></td>}
              <td className="px-4 py-3">Total</td>
              {columns.includes("due") && <td className="px-4 py-3"></td>}
              <td className="px-4 py-3 text-right tabular-nums">
                {formatCurrency(budgetTotal)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatCurrency(actualTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
