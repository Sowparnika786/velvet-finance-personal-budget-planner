export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  month: string; // YYYY-MM
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isCustom?: boolean;
}

export interface SavingsContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  contributions?: SavingsContribution[];
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface AppSettings {
  version: number;
  currency: CurrencyCode;
  defaultMonthlyBudget: number;
  enableSatinDecor: boolean;
  userName: string;
}

export interface MonthlySummary {
  income: number;
  expenses: number;
  balance: number;
  budget: number;
  remainingBudget: number;
  budgetUsedPercent: number;
  savingsRate: number;
  hasBudget: boolean;
}

export interface FinancialInsight {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  message: string;
}

export type TransactionSort = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export interface TransactionFilter {
  type: 'all' | TransactionType;
  category: string;
  month: string; // YYYY-MM or 'all'
  search: string;
  sortBy: TransactionSort;
}
