"use client";

import { signIn } from "next-auth/react";
import { Wallet, TrendingUp, PieChart, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-mint via-pastel-pink to-pastel-yellow dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Monthly Budget Planner
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Take control of your finances with our simple, powerful budgeting tool
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-2 border-gray-200 dark:border-gray-700"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </header>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <FeatureCard
            icon={<Wallet className="w-10 h-10" />}
            title="Track Income"
            description="Monitor all your income sources including salary, freelance work, and side hustles"
            color="bg-pastel-mint/60 dark:bg-emerald-900/30"
          />
          <FeatureCard
            icon={<TrendingUp className="w-10 h-10" />}
            title="Manage Expenses"
            description="Keep track of bills, debts, savings, and daily expenses in one place"
            color="bg-pastel-pink/60 dark:bg-pink-900/30"
          />
          <FeatureCard
            icon={<PieChart className="w-10 h-10" />}
            title="Visualize Data"
            description="Beautiful charts and graphs help you understand your spending patterns"
            color="bg-pastel-yellow/60 dark:bg-amber-900/30"
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10" />}
            title="Secure & Private"
            description="Your financial data is encrypted and accessible only to you"
            color="bg-pastel-mint/60 dark:bg-teal-900/30"
          />
        </div>

        {/* Screenshot/Demo Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Everything You Need in One Dashboard
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-left">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  📊 Real-time Overview
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  See your available budget, spending, and remaining funds at a glance
                </p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  📝 Transaction History
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete record of all your financial activities organized by category
                </p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  🎯 Budget Goals
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Set targets for each category and track your progress monthly
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Start managing your budget smarter, not harder
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="inline-flex items-center gap-3 px-8 py-4 bg-pastel-mint dark:bg-emerald-800 text-gray-900 dark:text-gray-100 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className={`${color} rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200/50 dark:border-gray-700/50`}>
      <div className="text-gray-900 dark:text-gray-100 mb-4">{icon}</div>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}
