import React, { useState } from 'react';
import {
  PiggyBank,
  AlertTriangle,
  History,
  Edit2,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { formatMonthYear } from '../utils/dates';
import {
  calculateMonthlyExpenses,
  calculateBudgetUtilization,
  calculateRemainingBudget,
} from '../utils/calculations';
import { SetBudgetModal } from '../components/budget/SetBudgetModal';
import { Budget } from '../types/finance';

export const BudgetPage: React.FC = () => {
  const {
    budgets,
    transactions,
    selectedMonth,
    currentMonthSummary,
    settings,
  } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetMonth, setModalTargetMonth] = useState<string>(selectedMonth);

  const { expenses, budget, remainingBudget, budgetUsedPercent, hasBudget } = currentMonthSummary;
  const isOverBudget = hasBudget && expenses > budget;

  const handleEditBudget = (m: string) => {
    setModalTargetMonth(m);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Active Month Budget Hero Card */}
      <div className="luxury-card p-6 sm:p-8 bg-gradient-to-br from-white via-beige-ivory/50 to-beige-warm/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-beige-champagne/60">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-espresso-muted">
              Active Budget Assessment
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-burgundy mt-1">
              {formatMonthYear(selectedMonth)}
            </h2>
            <p className="text-xs text-espresso-muted mt-1">
              Monthly spending cap and live pacing status
            </p>
          </div>

          <button
            onClick={() => handleEditBudget(selectedMonth)}
            className="flex items-center space-x-2 px-5 py-3 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne font-semibold text-xs tracking-wider transition-all shadow-md self-start md:self-auto active:scale-95"
          >
            <PiggyBank className="w-4 h-4" />
            <span>{hasBudget ? 'Adjust Budget Cap' : 'Establish Monthly Budget'}</span>
          </button>
        </div>

        {!hasBudget ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mb-4">
              <PiggyBank className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif font-bold text-burgundy mb-1">
              No Spending Cap Set for {formatMonthYear(selectedMonth)}
            </h3>
            <p className="text-xs text-espresso-muted max-w-sm mb-6 leading-relaxed">
              Setting a monthly budget enables Velvet Finance to safeguard your capital and warn you when expenses approach threshold limits.
            </p>
            <button
              onClick={() => handleEditBudget(selectedMonth)}
              className="px-6 py-2.5 rounded-luxury-sm bg-burgundy text-beige-champagne text-xs font-semibold hover:bg-burgundy-hover transition-colors shadow-sm"
            >
              Set Budget Now
            </button>
          </div>
        ) : (
          <div className="pt-6 space-y-6">
            {/* Visual Overspending Warning Banner */}
            {isOverBudget && (
              <div className="p-4 rounded-luxury-sm bg-danger-light border border-danger/40 flex items-start space-x-3 text-danger">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold uppercase tracking-wider">
                    Spending Cap Breached
                  </h4>
                  <p className="mt-0.5 leading-relaxed text-espresso font-medium">
                    You have exceeded your budgeted limit of {formatCurrency(budget, settings.currency)} by{' '}
                    <span className="font-bold text-danger">
                      {formatCurrency(expenses - budget, settings.currency)}
                    </span>{' '}
                    ({budgetUsedPercent}% utilization).
                  </p>
                </div>
              </div>
            )}

            {/* 3 Metric Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-luxury-sm bg-white border border-beige-champagne/60 shadow-sm">
                <span className="text-[11px] uppercase font-semibold text-espresso-muted">
                  Total Budget Limit
                </span>
                <p className="text-xl sm:text-2xl font-bold font-sans text-espresso mt-1">
                  {formatCurrency(budget, settings.currency)}
                </p>
              </div>

              <div className="p-4 rounded-luxury-sm bg-white border border-beige-champagne/60 shadow-sm">
                <span className="text-[11px] uppercase font-semibold text-espresso-muted">
                  Amount Spent
                </span>
                <p className="text-xl sm:text-2xl font-bold font-sans text-burgundy mt-1">
                  {formatCurrency(expenses, settings.currency)}
                </p>
                <span className="text-[11px] text-espresso-muted">
                  {budgetUsedPercent}% of allocation
                </span>
              </div>

              <div className="p-4 rounded-luxury-sm bg-white border border-beige-champagne/60 shadow-sm">
                <span className="text-[11px] uppercase font-semibold text-espresso-muted">
                  {isOverBudget ? 'Overspent Amount' : 'Remaining Budget'}
                </span>
                <p
                  className={`text-xl sm:text-2xl font-bold font-sans mt-1 ${
                    isOverBudget ? 'text-danger' : 'text-positive'
                  }`}
                >
                  {isOverBudget
                    ? `-${formatCurrency(expenses - budget, settings.currency)}`
                    : formatCurrency(remainingBudget, settings.currency)}
                </p>
                <span className="text-[11px] text-espresso-muted">
                  {isOverBudget ? 'Deficit' : `${Math.max(0, Math.round(100 - budgetUsedPercent))}% surplus headroom`}
                </span>
              </div>
            </div>

            {/* Visual Gauge */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-espresso">Progress Utilization</span>
                <span className={isOverBudget ? 'text-danger font-bold' : 'text-burgundy'}>
                  {budgetUsedPercent}%
                </span>
              </div>
              <div className="w-full bg-beige-ivory rounded-full h-4 overflow-hidden border border-beige-champagne/50">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    isOverBudget
                      ? 'bg-danger'
                      : budgetUsedPercent >= 90
                      ? 'bg-burgundy'
                      : budgetUsedPercent >= 70
                      ? 'bg-warning'
                      : 'bg-positive'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, budgetUsedPercent))}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-espresso-muted mt-1.5 font-medium">
                <span>0% Safe</span>
                <span>70% Caution</span>
                <span>90% Alert</span>
                <span>100% Limit</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Budget History Section */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-beige-warm/60">
          <div className="flex items-center space-x-2.5">
            <History className="w-5 h-5 text-burgundy" />
            <div>
              <h3 className="font-serif font-bold text-base text-burgundy">
                Historical Budget Performance
              </h3>
              <p className="text-xs text-espresso-muted">
                Track how previous monthly budgets performed against actual recorded outflows
              </p>
            </div>
          </div>
        </div>

        {budgets.length === 0 ? (
          <p className="text-xs text-espresso-muted py-6 text-center">
            No budget records stored yet. Set a budget above to begin tracking history.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-beige-champagne/40 text-[11px] uppercase font-semibold text-espresso-muted bg-beige-ivory/60">
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Budget Limit</th>
                  <th className="py-3 px-4">Actual Outflow</th>
                  <th className="py-3 px-4">Variance / Remainder</th>
                  <th className="py-3 px-4 text-center">Utilization</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-warm/30 text-xs">
                {budgets.map((b: Budget) => {
                  const mExpenses = calculateMonthlyExpenses(transactions, b.month);
                  const mRemaining = calculateRemainingBudget(b.amount, mExpenses);
                  const mUtil = calculateBudgetUtilization(b.amount, mExpenses);
                  const mOver = mExpenses > b.amount;

                  return (
                    <tr key={b.id} className="hover:bg-beige-warm/15 transition-colors">
                      <td className="py-3 px-4 font-serif font-bold text-burgundy">
                        {formatMonthYear(b.month)}
                      </td>
                      <td className="py-3 px-4 font-sans font-semibold text-espresso">
                        {formatCurrency(b.amount, settings.currency)}
                      </td>
                      <td className="py-3 px-4 font-sans font-semibold text-burgundy-secondary">
                        {formatCurrency(mExpenses, settings.currency)}
                      </td>
                      <td className="py-3 px-4 font-sans font-bold">
                        <span className={mOver ? 'text-danger' : 'text-positive'}>
                          {mOver ? '-' : '+'}
                          {formatCurrency(Math.abs(mRemaining), settings.currency)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            mOver
                              ? 'bg-danger-light text-danger'
                              : mUtil >= 90
                              ? 'bg-burgundy text-white'
                              : mUtil >= 70
                              ? 'bg-warning-light text-warning'
                              : 'bg-positive-light text-positive'
                          }`}
                        >
                          {mUtil}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleEditBudget(b.month)}
                          className="p-1 rounded-md text-espresso-muted hover:text-burgundy hover:bg-beige-warm/30 transition-colors"
                          title="Edit this budget"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SetBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetMonth={modalTargetMonth}
      />
    </div>
  );
};
