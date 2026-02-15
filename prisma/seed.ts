import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const month = 3; // March
  const year = 2025;

  // Clear existing data for this month (for re-seeding)
  await prisma.transaction.deleteMany({});
  await prisma.budgetConfig.deleteMany({});

  // BudgetConfig: targets matching the image
  const budgetConfigs = [
    // Income
    { month, year, category: "Salary", targetAmount: 6000, type: "INCOME" as const },
    { month, year, category: "Freelance", targetAmount: 3000, type: "INCOME" as const },
    { month, year, category: "Etsy", targetAmount: 1600, type: "INCOME" as const },
    // Bills (Rent/Bills: 370 total)
    { month, year, category: "Water Supply", targetAmount: 50, type: "BILL" as const },
    { month, year, category: "Electricity", targetAmount: 100, type: "BILL" as const },
    { month, year, category: "Cellphone", targetAmount: 100, type: "BILL" as const },
    { month, year, category: "Internet", targetAmount: 120, type: "BILL" as const },
    // Debts
    { month, year, category: "Car Installment", targetAmount: 1000, type: "DEBT" as const },
    { month, year, category: "Phone Installment", targetAmount: 1000, type: "DEBT" as const },
    { month, year, category: "Credit Card", targetAmount: 1000, type: "DEBT" as const },
    // Savings
    { month, year, category: "Account A", targetAmount: 800, type: "SAVING" as const },
    { month, year, category: "Account B", targetAmount: 100, type: "SAVING" as const },
    // Expense categories (target totals for grouping)
    { month, year, category: "Groceries", targetAmount: 600, type: "EXPENSE" as const },
    { month, year, category: "Dining Out", targetAmount: 400, type: "EXPENSE" as const },
    { month, year, category: "Fuel", targetAmount: 300, type: "EXPENSE" as const },
    { month, year, category: "Shopping", targetAmount: 500, type: "EXPENSE" as const },
    { month, year, category: "Utilities", targetAmount: 150, type: "EXPENSE" as const },
    { month, year, category: "Gift", targetAmount: 200, type: "EXPENSE" as const },
    { month, year, category: "Travelling", targetAmount: 500, type: "EXPENSE" as const },
    { month, year, category: "Miscellaneous", targetAmount: 1825, type: "EXPENSE" as const },
  ];

  await prisma.budgetConfig.createMany({ data: budgetConfigs });

  // Transactions: actual amounts matching the image
  const transactions = [
    // Income
    { date: new Date(year, month - 1, 1), description: "Monthly salary", amount: 5800, category: "Salary", type: "INCOME" as const },
    { date: new Date(year, month - 1, 5), description: "Freelance project", amount: 1800, category: "Freelance", type: "INCOME" as const },
    { date: new Date(year, month - 1, 10), description: "Etsy sales", amount: 1900, category: "Etsy", type: "INCOME" as const },
    // Bills
    { date: new Date(year, month - 1, 10), description: "Water bill", amount: 10, category: "Water Supply", type: "BILL" as const },
    { date: new Date(year, month - 1, 10), description: "Electricity", amount: 80, category: "Electricity", type: "BILL" as const },
    { date: new Date(year, month - 1, 25), description: "Cell plan", amount: 50, category: "Cellphone", type: "BILL" as const },
    { date: new Date(year, month - 1, 15), description: "Internet", amount: 65, category: "Internet", type: "BILL" as const },
    // Debts
    { date: new Date(year, month - 1, 10), description: "Car payment", amount: 1000, category: "Car Installment", type: "DEBT" as const },
    { date: new Date(year, month - 1, 11), description: "Phone payment", amount: 200, category: "Phone Installment", type: "DEBT" as const },
    { date: new Date(year, month - 1, 20), description: "Credit card", amount: 500, category: "Credit Card", type: "DEBT" as const },
    // Savings
    { date: new Date(year, month - 1, 1), description: "Savings transfer", amount: 800, category: "Account A", type: "SAVING" as const },
    { date: new Date(year, month - 1, 1), description: "Emergency fund", amount: 100, category: "Account B", type: "SAVING" as const },
    // Expenses (Expense Tracker items - totals ~3000)
    { date: new Date(year, month - 1, 2), description: "Food", amount: 80, category: "Groceries", type: "EXPENSE" as const },
    { date: new Date(year, month - 1, 3), description: "Knife", amount: 10, category: "Utilities", type: "EXPENSE" as const },
    { date: new Date(year, month - 1, 10), description: "Dinner with Colleague", amount: 38, category: "Dining Out", type: "EXPENSE" as const },
    { date: new Date(year, month - 1, 12), description: "Jacket", amount: 100, category: "Shopping", type: "EXPENSE" as const },
    { date: new Date(year, month - 1, 15), description: "Gas", amount: 55, category: "Fuel", type: "EXPENSE" as const },
    { date: new Date(year, month - 1, 18), description: "Birthday", amount: 50, category: "Gift", type: "EXPENSE" as const },
    { date: new Date(year, month - 1, 20), description: "Hotel", amount: 120, category: "Travelling", type: "EXPENSE" as const },
    { date: new Date(year, month - 1, 22), description: "Weekly shopping", amount: 95, category: "Groceries", type: "EXPENSE" as const },
    { date: new Date(year, month - 1, 25), description: "Lunch", amount: 25, category: "Dining Out", type: "EXPENSE" as const },
    { date: new Date(year, month - 1, 28), description: "Misc item", amount: 2427, category: "Miscellaneous", type: "EXPENSE" as const }, // 80+10+38+100+55+50+120+95+25=573, 2427+573=3000
  ];

  for (const t of transactions) {
    await prisma.transaction.create({
      data: {
        date: t.date,
        description: t.description,
        amount: t.amount,
        category: t.category,
        type: t.type,
      },
    });
  }

  console.log("Seed completed. Created:", {
    budgetConfigs: budgetConfigs.length,
    transactions: transactions.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
