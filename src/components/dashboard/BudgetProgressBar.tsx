import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, PiggyBank, ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/currency';
import { formatMonthYear } from '../../utils/dates';

interface BudgetProgressBarProps {
  onOpenSetBudget: () => void;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({ onOpenSetBudget }) => {
  const { currentMonthSummary, selectedMonth, settings } = useFinance();
  const { expenses, budget, remainingBudget, budgetUsedPercent, hasBudget } = currentMonthSummary;

  if (!hasBudget) {
    return (
      <div className="luxury-card p-6 flex flex-col sm:flex-row items-center justify-between border-dashed border-beige-champagne/80 bg-white/70 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-luxury-sm bg-burgundy/10 text-burgundy flex items-center justify-center flex-shrink-0">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-burgundy text-base">
              No Budget Set for {formatMonthYear(selectedMonth)}
            </h4>
            <p className="text-xs text-espresso-muted mt-0.5">
              Establish a spending limit to track pacing and unlock real-time financial warnings.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSetBudget}
          className="w-full sm:w-auto px-5 py-2.5 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center space-x-2"
        >
          <span>Set Monthly Budget</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const isOverBudget = expenses > budget;
  const isHighBudget = budgetUsedPercent >= 90;
  const isMediumBudget = budgetUsedPercent >= 70 && budgetUsedPercent < 90;

  // Visual status configurations
  let statusColor = 'bg-positive';
  let badgeStyle = 'bg-positive-light text-positive border-positive/30';
  let StatusIcon = CheckCircle2;
  let statusText = 'Within Target';

  if (isOverBudget) {
    statusColor = 'bg-danger';
    badgeStyle = 'bg-danger-light text-danger border-danger/30';
    StatusIcon = AlertCircle;
    statusText = 'Budget Exceeded';
  } else if (isHighBudget) {
    statusColor = 'bg-burgundy';
    badgeStyle = 'bg-danger-light text-burgundy border-burgundy/30';
    StatusIcon = AlertTriangle;
    statusText = 'Critical Cap (≥90%)';
  } else if (isMediumBudget) {
    statusColor = 'bg-warning';
    badgeStyle = 'bg-warning-light text-warning border-warning/30';
    StatusIcon = AlertTriangle;
    statusText = 'Caution (70%–89%)';
  }

  const progressWidth = Math.min(100, Math.max(0, budgetUsedPercent));

  return (
    <div className="luxury-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2.5">
          <StatusIcon className={`w-5 h-5 ${isOverBudget ? 'text-danger' : isHighBudget ? 'text-burgundy' : isMediumBudget ? 'text-warning' : 'text-positive'}`} />
          <h3 className="font-serif font-bold text-base text-burgundy">
            Budget Progress — {formatMonthYear(selectedMonth)}
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}>
            {statusText}
          </span>
          <button
            onClick={onOpenSetBudget}
            className="text-xs text-burgundy hover:underline font-semibold"
          >
            Adjust Budget
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-beige-ivory rounded-full h-3.5 overflow-hidden border border-beige-champagne/40 relative">
        <div
          className={`h-full ${statusColor} transition-all duration-700 rounded-full`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* Figures Row */}
      <div className="flex items-center justify-between text-xs text-espresso-muted mt-2.5">
        <div>
          <span className="font-semibold text-espresso">
            {formatCurrency(expenses, settings.currency)}
          </span>{' '}
          spent of{' '}
          <span className="font-semibold text-espresso">
            {formatCurrency(budget, settings.currency)}
          </span>
        </div>

        <div>
          {isOverBudget ? (
            <span className="font-bold text-danger">
              Overspent by {formatCurrency(expenses - budget, settings.currency)} ({budgetUsedPercent}%)
            </span>
          ) : (
            <span className="font-medium text-espresso">
              {formatCurrency(remainingBudget, settings.currency)} remaining ({roundNumber(100 - budgetUsedPercent)}% left)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const roundNumber = (num: number) => Math.max(0, Math.round(num * 10) / 10);
