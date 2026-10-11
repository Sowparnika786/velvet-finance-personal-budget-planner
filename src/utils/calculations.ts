import { Transaction, Budget, MonthlySummary, FinancialInsight } from '../types/finance';

/**
 * Rounds a number to 2 decimal places safely avoiding floating point quirks.
 */
export const roundToTwoDecimals = (val: number): number => {
  return Math.round((val + Number.EPSILON) * 100) / 100;
};

/**
 * Checks if a transaction belongs to a given month (YYYY-MM).
 * Uses ISO date prefix comparison to avoid timezone shift errors.
 */
export const isTransactionInMonth = (txDate: string, monthKey: string): boolean => {
  if (!txDate || !monthKey) return false;
  return txDate.startsWith(monthKey);
};

/**
 * Calculates total income for a given month.
 */
export const calculateMonthlyIncome = (transactions: Transaction[], monthKey: string): number => {
  const sum = transactions
    .filter(tx => tx.type === 'income' && isTransactionInMonth(tx.date, monthKey))
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
  return roundToTwoDecimals(sum);
};

/**
 * Calculates total expenses for a given month.
 */
export const calculateMonthlyExpenses = (transactions: Transaction[], monthKey: string): number => {
  const sum = transactions
    .filter(tx => tx.type === 'expense' && isTransactionInMonth(tx.date, monthKey))
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
  return roundToTwoDecimals(sum);
};

/**
 * Calculates remaining balance (Monthly Income - Monthly Expenses).
 */
export const calculateRemainingBalance = (income: number, expenses: number): number => {
  return roundToTwoDecimals(income - expenses);
};

/**
 * Calculates remaining budget (Monthly Budget - Monthly Expenses).
 */
export const calculateRemainingBudget = (budgetAmount: number, expenses: number): number => {
  return roundToTwoDecimals(budgetAmount - expenses);
};

/**
 * Calculates budget utilization percentage.
 * Avoids division by zero if budget is 0 or not set.
 */
export const calculateBudgetUtilization = (budgetAmount: number, expenses: number): number => {
  if (!budgetAmount || budgetAmount <= 0) return 0;
  const percent = (expenses / budgetAmount) * 100;
  return roundToTwoDecimals(percent);
};

/**
 * Calculates savings rate percentage.
 * Formula: ((Income - Expenses) / Income) * 100.
 * Safely handles zero or negative income.
 */
export const calculateSavingsRate = (income: number, expenses: number): number => {
  if (!income || income <= 0) return 0;
  const rate = ((income - expenses) / income) * 100;
  return roundToTwoDecimals(Math.max(-100, Math.min(100, rate)));
};

/**
 * Aggregates complete monthly summary for the dashboard cards.
 */
export const getMonthlySummary = (
  transactions: Transaction[],
  budget: Budget | undefined,
  monthKey: string
): MonthlySummary => {
  const income = calculateMonthlyIncome(transactions, monthKey);
  const expenses = calculateMonthlyExpenses(transactions, monthKey);
  const balance = calculateRemainingBalance(income, expenses);
  const budgetAmount = budget ? Number(budget.amount) : 0;
  const remainingBudget = calculateRemainingBudget(budgetAmount, expenses);
  const budgetUsedPercent = calculateBudgetUtilization(budgetAmount, expenses);
  const savingsRate = calculateSavingsRate(income, expenses);

  return {
    income,
    expenses,
    balance,
    budget: budgetAmount,
    remainingBudget,
    budgetUsedPercent,
    savingsRate,
    hasBudget: Boolean(budget && budget.amount > 0),
  };
};

/**
 * Calculates category-wise expense breakdown with percentages.
 */
export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export const getCategoryExpenseBreakdown = (
  transactions: Transaction[],
  monthKey: string
): CategoryBreakdownItem[] => {
  const monthlyExpenses = transactions.filter(
    tx => tx.type === 'expense' && isTransactionInMonth(tx.date, monthKey)
  );

  const totalExpense = monthlyExpenses.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

  const categoryMap = new Map<string, { amount: number; count: number }>();

  for (const tx of monthlyExpenses) {
    const current = categoryMap.get(tx.category) || { amount: 0, count: 0 };
    categoryMap.set(tx.category, {
      amount: current.amount + (Number(tx.amount) || 0),
      count: current.count + 1,
    });
  }

  const breakdown: CategoryBreakdownItem[] = [];

  categoryMap.forEach((val, cat) => {
    const amount = roundToTwoDecimals(val.amount);
    const percentage = totalExpense > 0 ? roundToTwoDecimals((amount / totalExpense) * 100) : 0;
    breakdown.push({
      category: cat,
      amount,
      percentage,
      transactionCount: val.count,
    });
  });

  return breakdown.sort((a, b) => b.amount - a.amount);
};

/**
 * Generates rule-based financial insights using live data.
 */
export const generateFinancialInsights = (
  summary: MonthlySummary,
  categoryBreakdown: CategoryBreakdownItem[],
  formatMoney: (val: number) => string
): FinancialInsight[] => {
  const insights: FinancialInsight[] = [];

  // Budget status insight
  if (summary.hasBudget) {
    if (summary.expenses > summary.budget) {
      const overspent = roundToTwoDecimals(summary.expenses - summary.budget);
      insights.push({
        id: 'budget-over',
        type: 'alert',
        title: 'Budget Exceeded',
        message: `You have exceeded your monthly budget by ${formatMoney(overspent)}. Consider reviewing non-essential categories.`,
      });
    } else if (summary.budgetUsedPercent >= 90) {
      insights.push({
        id: 'budget-high',
        type: 'warning',
        title: 'Budget Limit Approaching',
        message: `You have utilized ${summary.budgetUsedPercent}% of your monthly budget. ${formatMoney(summary.remainingBudget)} remaining.`,
      });
    } else if (summary.budgetUsedPercent > 0) {
      insights.push({
        id: 'budget-healthy',
        type: 'info',
        title: 'Healthy Budget Pacing',
        message: `You have used ${summary.budgetUsedPercent}% of your monthly budget with ${formatMoney(summary.remainingBudget)} remaining.`,
      });
    }
  } else {
    insights.push({
      id: 'no-budget',
      type: 'info',
      title: 'Set Monthly Target',
      message: 'Setting a monthly spending budget helps you monitor limits and achieve higher savings.',
    });
  }

  // Top spending category insight
  if (categoryBreakdown.length > 0) {
    const top = categoryBreakdown[0];
    insights.push({
      id: 'top-category',
      type: 'info',
      title: 'Top Expense Category',
      message: `${top.category} is your highest spending category at ${formatMoney(top.amount)} (${top.percentage}% of monthly spending).`,
    });
  }

  // Savings rate insight
  if (summary.income > 0) {
    if (summary.savingsRate >= 20) {
      insights.push({
        id: 'savings-good',
        type: 'success',
        title: 'Strong Savings Discipline',
        message: `Your savings rate is ${summary.savingsRate}%, well above the standard 20% financial wellness benchmark.`,
      });
    } else if (summary.savingsRate > 0) {
      insights.push({
        id: 'savings-moderate',
        type: 'info',
        title: 'Positive Net Savings',
        message: `You have saved ${formatMoney(summary.balance)} this month (${summary.savingsRate}% of income).`,
      });
    } else if (summary.balance < 0) {
      insights.push({
        id: 'balance-deficit',
        type: 'alert',
        title: 'Monthly Cashflow Deficit',
        message: `Expenses exceed income by ${formatMoney(Math.abs(summary.balance))}. Review recurring expenses.`,
      });
    }
  }

  return insights;
};
