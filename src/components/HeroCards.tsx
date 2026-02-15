import { Wallet, CreditCard, PiggyBank, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export interface HeroCardsProps {
  availableBudget: number;
  availableSpending: number;
  remainingBudget: number;
  remainingSpending: number;
}

const cardsConfig = [
  {
    key: "availableBudget",
    title: "Available Budget",
    icon: Wallet,
    bgColor: "bg-pastel-pink/80 dark:bg-pink-900/30",
  },
  {
    key: "availableSpending",
    title: "Available Spending",
    icon: CreditCard,
    bgColor: "bg-pastel-mint/80 dark:bg-emerald-900/30",
  },
  {
    key: "remainingBudget",
    title: "Remaining Budget",
    icon: PiggyBank,
    bgColor: "bg-pastel-yellow/80 dark:bg-amber-900/30",
  },
  {
    key: "remainingSpending",
    title: "Remaining Spending",
    icon: TrendingUp,
    bgColor: "bg-pastel-pink/80 dark:bg-pink-900/30",
  },
];

export default function HeroCards({
  availableBudget = 0,
  availableSpending = 0,
  remainingBudget = 0,
  remainingSpending = 0,
}: HeroCardsProps) {
  const values = {
    availableBudget: formatCurrency(availableBudget),
    availableSpending: formatCurrency(availableSpending),
    remainingBudget: formatCurrency(remainingBudget),
    remainingSpending: formatCurrency(remainingSpending),
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cardsConfig.map((card) => {
        const Icon = card.icon;
        const value = values[card.key as keyof typeof values];
        return (
          <div
            key={card.title}
            className={`${card.bgColor} p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50 transition-all duration-200 hover:shadow-md hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
              <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {value}
            </p>
          </div>
        );
      })}
    </section>
  );
}
