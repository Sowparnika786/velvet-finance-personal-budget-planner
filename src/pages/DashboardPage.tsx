import React, { useState } from 'react';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { ExpenseDonutChart } from '../components/dashboard/ExpenseDonutChart';
import { BudgetProgressBar } from '../components/dashboard/BudgetProgressBar';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { InsightsCard } from '../components/dashboard/InsightsCard';
import { SetBudgetModal } from '../components/budget/SetBudgetModal';
import { PageId } from '../components/layout/Sidebar';

interface DashboardPageProps {
  setActivePage: (page: PageId) => void;
  onOpenAddTransaction: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActivePage,
  onOpenAddTransaction,
}) => {
  const [isSetBudgetOpen, setIsSetBudgetOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 4 Premium Summary Cards */}
      <SummaryCards onSetBudgetClick={() => setIsSetBudgetOpen(true)} />

      {/* Budget Progress Bar & Overspending Alert */}
      <BudgetProgressBar onOpenSetBudget={() => setIsSetBudgetOpen(true)} />

      {/* Charts Grid: Monthly Bar Chart & Expense Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <ExpenseDonutChart />
      </div>

      {/* Recent Transactions & Financial Intelligence Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions
          onViewAllClick={() => setActivePage('transactions')}
          onOpenAddTransaction={onOpenAddTransaction}
        />
        <InsightsCard />
      </div>

      {/* Set Monthly Budget Modal */}
      <SetBudgetModal
        isOpen={isSetBudgetOpen}
        onClose={() => setIsSetBudgetOpen(false)}
      />
    </div>
  );
};
