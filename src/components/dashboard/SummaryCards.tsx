import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { StatCard } from '../common/StatCard';
import { formatCurrency } from '../../utils/currency';
import { formatShortMonthYear } from '../../utils/dates';

interface SummaryCardsProps {
  onSetBudgetClick?: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ onSetBudgetClick }) => {
  const { currentMonthSummary, selectedMonth, settings } = useFinance();
  const {
    income,
    expenses,
    balance,
    budget,
    remainingBudget,
    budgetUsedPercent,
    hasBudget,
  } = currentMonthSummary;

  const monthLabel = formatShortMonthYear(selectedMonth);

  // Remaining budget trend style
  const isOverBudget = hasBudget && expenses > budget;
  const budgetTrendType = isOverBudget
    ? 'danger'
    : budgetUsedPercent >= 90
    ? 'warning'
    : 'positive';

  const budgetSubtitle = hasBudget
    ? isOverBudget
      ? `Exceeded by ${formatCurrency(Math.abs(remainingBudget), settings.currency)}`
      : `${formatCurrency(remainingBudget, settings.currency)} left of ${formatCurrency(budget, settings.currency)}`
    : 'No budget established';

  const balanceTrendType = balance >= 0 ? 'positive' : 'danger';
  const balanceSubtitle = balance >= 0
    ? `Surplus in ${monthLabel}`
    : `Deficit in ${monthLabel}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* CARD 1: Total Income */}
      <StatCard
        title="Total Income"
        amount={formatCurrency(income, settings.currency)}
        subtitle={`Inflows for ${monthLabel}`}
        icon={TrendingUp}
        iconBgColor="bg-positive-light"
        iconColor="text-positive"
        trendText={`${currentMonthSummary.savingsRate > 0 ? `${currentMonthSummary.savingsRate}% saved` : '0% saved'}`}
        trendType="positive"
      />

      {/* CARD 2: Total Expenses */}
      <StatCard
        title="Total Expenses"
        amount={formatCurrency(expenses, settings.currency)}
        subtitle={hasBudget ? `${budgetUsedPercent}% of budget cap` : 'Outflows for month'}
        icon={TrendingDown}
        iconBgColor="bg-danger-light"
        iconColor="text-danger"
        trendText={hasBudget ? `${budgetUsedPercent}% utilized` : 'No budget set'}
        trendType={isOverBudget ? 'danger' : budgetUsedPercent >= 70 ? 'warning' : 'neutral'}
        progress={hasBudget ? Math.min(100, budgetUsedPercent) : undefined}
        progressColor={isOverBudget ? 'bg-danger' : budgetUsedPercent >= 90 ? 'bg-burgundy' : 'bg-warning'}
      />

      {/* CARD 3: Remaining Balance */}
      <StatCard
        title="Remaining Balance"
        amount={formatCurrency(balance, settings.currency)}
        subtitle={balanceSubtitle}
        icon={balance >= 0 ? Wallet : Scale}
        iconBgColor={balance >= 0 ? 'bg-gold/20' : 'bg-danger-light'}
        iconColor={balance >= 0 ? 'text-gold-dark' : 'text-danger'}
        trendText={balance >= 0 ? 'Surplus' : 'Deficit'}
        trendType={balanceTrendType}
      />

      {/* CARD 4: Remaining Budget */}
      <div className="relative">
        <StatCard
          title="Remaining Budget"
          amount={hasBudget ? formatCurrency(remainingBudget, settings.currency) : 'Not Set'}
          subtitle={budgetSubtitle}
          icon={isOverBudget ? ShieldAlert : Wallet}
          iconBgColor={isOverBudget ? 'bg-danger-light' : 'bg-beige-warm/40'}
          iconColor={isOverBudget ? 'text-danger' : 'text-burgundy'}
          trendText={
            hasBudget
              ? isOverBudget
                ? 'Over Budget'
                : `${100 - Math.min(100, budgetUsedPercent)}% Left`
              : 'Setup'
          }
          trendType={hasBudget ? budgetTrendType : 'neutral'}
          progress={hasBudget ? Math.min(100, budgetUsedPercent) : undefined}
          progressColor={
            isOverBudget
              ? 'bg-danger'
              : budgetUsedPercent >= 90
              ? 'bg-burgundy'
              : budgetUsedPercent >= 70
              ? 'bg-warning'
              : 'bg-positive'
          }
        />
        {!hasBudget && onSetBudgetClick && (
          <button
            onClick={onSetBudgetClick}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Set budget for this month"
          />
        )}
      </div>
    </div>
  );
};
