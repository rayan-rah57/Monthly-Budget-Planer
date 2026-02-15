"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import Header from "@/components/Header";
import HeroCards from "@/components/HeroCards";
import DonutChart, { type DonutChartDataItem } from "@/components/DonutChart";
import DataTable, { type TableRow } from "@/components/DataTable";
import SummaryTable, { type SummaryRow } from "@/components/SummaryTable";
import ExpenseTracker from "@/components/ExpenseTracker";
import AddTransactionModal, { type TransactionFormData } from "@/components/AddTransactionModal";
import {
  totalIncome,
  totalSpent,
  totalBudget,
  remainingBudget,
  totalSpending,
} from "@/lib/budgetUtils";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const MONTH_TO_NUM: Record<string, number> = {
  JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
  JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12,
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: string;
  date: string;
  description?: string;
}

interface BudgetConfig {
  type: string;
  category: string;
  targetAmount: string;
}

function formatDateForDue(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function buildTableRows(
  configs: BudgetConfig[],
  transactions: Transaction[],
  type: "BILL" | "DEBT" | "SAVING",
  hasDue: boolean
): TableRow[] {
  const typeConfigs = configs.filter((c) => c.type === type);
  const typeTx = transactions.filter((t) => t.type === type);

  const actualByCategory: Record<string, { sum: number; txIds: string[] }> = {};
  for (const t of typeTx) {
    if (!actualByCategory[t.category]) {
      actualByCategory[t.category] = { sum: 0, txIds: [] };
    }
    actualByCategory[t.category].sum += parseFloat(t.amount);
    actualByCategory[t.category].txIds.push(t.id);
  }

  const dateByCategory: Record<string, string> = {};
  for (const t of typeTx) {
    if (!dateByCategory[t.category]) dateByCategory[t.category] = t.date;
    else if (t.date < dateByCategory[t.category]) dateByCategory[t.category] = t.date;
  }

  return typeConfigs.map((c, i) => {
    const actual = actualByCategory[c.category]?.sum ?? 0;
    const budget = parseFloat(c.targetAmount);
    const txIds = actualByCategory[c.category]?.txIds ?? [];
    return {
      id: `${type}-${c.category}-${i}`,
      label: c.category,
      due: hasDue ? formatDateForDue(dateByCategory[c.category] ?? new Date().toISOString()) : undefined,
      budget: budget.toFixed(2),
      actual: actual.toFixed(2),
      checked: actual >= budget,
      transactionId: txIds[0],
      type,
    };
  });
}

export default function Home() {
  const [month, setMonth] = useState("MARCH");
  const [year, setYear] = useState(2025);
  const [modalOpen, setModalOpen] = useState(false);

  const monthNum = MONTH_TO_NUM[month] ?? 3;

  const transactionsKey = `/api/transactions?month=${monthNum}&year=${year}`;
  const configKey = `/api/budget-config?month=${monthNum}&year=${year}`;

  const { data: txData, isLoading: txLoading, mutate: mutateTransactions } = useSWR<Transaction[]>(
    transactionsKey,
    fetcher
  );
  const { data: configData, isLoading: configLoading } = useSWR<BudgetConfig[]>(
    configKey,
    fetcher
  );

  const transactions: Transaction[] = Array.isArray(txData) ? txData : [];
  const budgetConfigs: BudgetConfig[] = Array.isArray(configData) ? configData : [];
  const loading = txLoading || configLoading;

  const getTransactionDate = useCallback(() => {
    const now = new Date();
    if (now.getFullYear() === year && now.getMonth() + 1 === monthNum) {
      return now.toISOString();
    }
    return new Date(year, monthNum - 1, 15).toISOString();
  }, [year, monthNum]);

  const handleAddTransaction = useCallback(
    async (data: TransactionFormData) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: getTransactionDate(),
          description: data.description,
          amount: data.amount,
          category: data.category,
          type: data.type,
        }),
      });
      if (!res.ok) throw new Error("Failed to add transaction");
      await mutateTransactions();
    },
    [mutateTransactions, getTransactionDate]
  );

  const handleCheckChange = useCallback(
    async (row: TableRow, checked: boolean) => {
      if (!checked || !row.type || row.checked) return;
      const budget = parseFloat(row.budget);
      const actual = parseFloat(row.actual);
      const remainder = budget - actual;
      if (remainder <= 0) return;

      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: getTransactionDate(),
            description: `Paid in full: ${row.label}`,
            amount: remainder,
            category: row.label,
            type: row.type,
          }),
        });
        await mutateTransactions();
      } catch (err) {
        console.error("Failed to mark as paid:", err);
      }
    },
    [mutateTransactions, getTransactionDate]
  );

  const tb = totalBudget(budgetConfigs);
  const ti = totalIncome(transactions);
  const ts = totalSpent(transactions);
  const rb = remainingBudget(tb, ts);
  const totalSpentAll = totalSpending(transactions);
  const remainingSpending = Math.max(0, ti - totalSpentAll);

  const billsRows = buildTableRows(budgetConfigs, transactions, "BILL", true);
  const debtsRows = buildTableRows(budgetConfigs, transactions, "DEBT", true);
  const savingsRows = buildTableRows(budgetConfigs, transactions, "SAVING", false);

  const incomeByCategory: Record<string, number> = {};
  for (const t of transactions.filter((x) => x.type === "INCOME")) {
    incomeByCategory[t.category] = (incomeByCategory[t.category] ?? 0) + parseFloat(t.amount);
  }
  const incomeData: DonutChartDataItem[] = Object.entries(incomeByCategory).map(
    ([name, value]) => ({ name, value })
  );
  const spendingByCategory: Record<string, number> = {};
  for (const t of transactions.filter((x) =>
    ["BILL", "EXPENSE", "DEBT", "SAVING"].includes(x.type)
  )) {
    const cat =
      t.type === "BILL" ? "Bills" : t.type === "EXPENSE" ? "Expenses" : t.type === "DEBT" ? "Debts" : "Savings";
    spendingByCategory[cat] = (spendingByCategory[cat] ?? 0) + parseFloat(t.amount);
  }
  const spendingData: DonutChartDataItem[] = Object.entries(spendingByCategory).map(
    ([name, value]) => ({ name, value })
  );

  const incomeSummaryRows: SummaryRow[] = budgetConfigs
    .filter((c) => c.type === "INCOME")
    .map((c) => ({
      label: c.category,
      budget: parseFloat(c.targetAmount),
      actual: incomeByCategory[c.category] ?? 0,
    }));

  const billsActual = transactions
    .filter((t) => t.type === "BILL")
    .reduce((s, t) => s + parseFloat(t.amount), 0);
  const billsBudget = budgetConfigs
    .filter((c) => c.type === "BILL")
    .reduce((s, c) => s + parseFloat(c.targetAmount), 0);
  const expensesActual = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + parseFloat(t.amount), 0);
  const expensesBudget = budgetConfigs
    .filter((c) => c.type === "EXPENSE")
    .reduce((s, c) => s + parseFloat(c.targetAmount), 0);
  const savingsActual = transactions
    .filter((t) => t.type === "SAVING")
    .reduce((s, t) => s + parseFloat(t.amount), 0);
  const savingsBudget = budgetConfigs
    .filter((c) => c.type === "SAVING")
    .reduce((s, c) => s + parseFloat(c.targetAmount), 0);
  const debtsActual = transactions
    .filter((t) => t.type === "DEBT")
    .reduce((s, t) => s + parseFloat(t.amount), 0);
  const debtsBudget = budgetConfigs
    .filter((c) => c.type === "DEBT")
    .reduce((s, c) => s + parseFloat(c.targetAmount), 0);

  const spendingSummaryRows: SummaryRow[] = [
    { label: "Bills", budget: billsBudget, actual: billsActual },
    { label: "Expenses", budget: expensesBudget, actual: expensesActual },
    { label: "Savings", budget: savingsBudget, actual: savingsActual },
    { label: "Debts", budget: debtsBudget, actual: debtsActual },
  ];

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900 p-4 sm:p-5 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
        <Header
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />

        <HeroCards
          availableBudget={tb}
          availableSpending={ti}
          remainingBudget={rb}
          remainingSpending={remainingSpending}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pastel-mint dark:bg-emerald-800 text-gray-900 dark:text-gray-100 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Transaction
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          <div className="lg:col-span-1 space-y-6">
            <DonutChart
              title="Income Breakdown"
              data={incomeData}
              centerValue={formatCurrency(ti)}
              colorScheme="income"
            />
            <DonutChart
              title="Spending Breakdown"
              data={spendingData}
              centerValue={formatCurrency(totalSpentAll)}
              colorScheme="spending"
            />
            {incomeSummaryRows.length > 0 && (
              <SummaryTable title="Income" rows={incomeSummaryRows} variant="income" />
            )}
            <SummaryTable title="Spending" rows={spendingSummaryRows} variant="spending" />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <DataTable
              title="Bills"
              rows={billsRows}
              columns={["due", "budget", "actual"]}
              onCheckChange={handleCheckChange}
            />
            <DataTable
              title="Debts"
              rows={debtsRows}
              columns={["due", "budget", "actual"]}
              onCheckChange={handleCheckChange}
            />
            <DataTable
              title="Savings"
              rows={savingsRows}
              columns={["budget", "actual"]}
              onCheckChange={handleCheckChange}
            />
          </div>

          <div className="lg:col-span-1">
            <ExpenseTracker transactions={transactions} />
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 py-4">
          AVAILABLE IN LAPTOP / TABLET / MOBILE
        </p>
      </div>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
}
