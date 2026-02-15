export interface TransactionData {
  id: string;
  type: string;
  category: string;
  amount: string | number;
}

export interface BudgetConfigData {
  type: string;
  category: string;
  targetAmount: string | number;
}

/**
 * Total Income - Sum of all INCOME type transactions
 */
export function totalIncome(transactions: TransactionData[]): number {
  return transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);
}

/**
 * Total Spent - Sum of all EXPENSE type transactions
 */
export function totalSpent(transactions: TransactionData[]): number {
  return transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);
}

/**
 * Total Budget - Sum of INCOME targetAmount from budget config (available budget)
 */
export function totalBudget(budgetConfigs: BudgetConfigData[]): number {
  return budgetConfigs
    .filter((c) => c.type === "INCOME")
    .reduce((sum, c) => sum + parseAmount(c.targetAmount), 0);
}

/**
 * Remaining Budget = Total Budget - Total Spent
 */
export function remainingBudget(
  totalBudgetAmount: number,
  totalSpentAmount: number
): number {
  return Math.max(0, totalBudgetAmount - totalSpentAmount);
}

/**
 * Total of BILL + EXPENSE + DEBT + SAVING transactions (all spending)
 */
export function totalSpending(transactions: TransactionData[]): number {
  return transactions
    .filter((t) =>
      ["BILL", "EXPENSE", "DEBT", "SAVING"].includes(t.type)
    )
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);
}

function parseAmount(val: string | number): number {
  if (typeof val === "number") return val;
  return parseFloat(String(val).replace(/,/g, "")) || 0;
}
