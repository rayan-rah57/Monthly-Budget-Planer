import { formatCurrency } from "@/lib/format";

interface ExpenseRow {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: string;
}

interface ExpenseTrackerProps {
  transactions: Array<{
    id: string;
    type: string;
    date: string;
    category: string;
    description?: string;
    amount: string;
  }>;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
}

export default function ExpenseTracker({ transactions }: ExpenseTrackerProps) {
  const rows: ExpenseRow[] = transactions
    .filter((t) => ["EXPENSE", "BILL", "DEBT", "SAVING"].includes(t.type))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((t) => ({
      id: t.id,
      date: formatDate(t.date),
      category: t.category,
      description: t.description ?? "",
      amount: typeof t.amount === "string" ? parseFloat(t.amount).toFixed(2) : Number(t.amount).toFixed(2),
    }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full min-h-[400px] transition-shadow hover:shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
        Expense Tracker
      </h3>
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-pastel-mint/30 dark:bg-gray-700/50 z-10">
            <tr className="text-gray-600 dark:text-gray-400">
              <th className="px-4 py-2.5 text-left font-medium">Date</th>
              <th className="px-4 py-2.5 text-left font-medium">Category</th>
              <th className="px-4 py-2.5 text-left font-medium">Description</th>
              <th className="px-4 py-2.5 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No transactions yet. Add one to get started.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-50 dark:border-gray-700/50 transition-colors duration-150 hover:bg-pastel-pink/20 dark:hover:bg-gray-700/30"
                >
                  <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">{row.date}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200">
                    {row.category}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">{row.description}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-800 dark:text-gray-200 tabular-nums">
                    {formatCurrency(row.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
