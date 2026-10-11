import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Transaction,
  Budget,
  Category,
  SavingsGoal,
  AppSettings,
  MonthlySummary,
  FinancialInsight,
} from '../types/finance';
import { BackupData } from '../utils/exportImport';
import {
  loadFromStorage,
  saveToStorage,
  clearAllFinanceStorage,
  STORAGE_KEYS,
} from '../utils/storage';
import { INITIAL_CATEGORIES } from '../data/defaultCategories';
import {
  DEMO_TRANSACTIONS,
  DEMO_BUDGETS,
  DEMO_SAVINGS_GOALS,
  DEMO_SETTINGS,
} from '../data/demoData';
import {
  getMonthlySummary,
  getCategoryExpenseBreakdown,
  generateFinancialInsights,
  CategoryBreakdownItem,
} from '../utils/calculations';
import { getCurrentMonthKey, getTodayDateString } from '../utils/dates';
import { formatCurrency } from '../utils/currency';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface FinanceContextType {
  // State
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  savingsGoals: SavingsGoal[];
  settings: AppSettings;
  selectedMonth: string;
  toasts: ToastMessage[];

  // Computed for selected month
  currentMonthSummary: MonthlySummary;
  categoryBreakdown: CategoryBreakdownItem[];
  insights: FinancialInsight[];
  currentMonthBudget?: Budget;

  // Actions
  setSelectedMonth: (month: string) => void;
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
  setMonthlyBudget: (month: string, amount: number) => void;
  addCategory: (data: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string, reassignToCategoryName?: string) => void;
  addSavingsGoal: (data: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt' | 'contributions'>) => void;
  updateSavingsGoal: (id: string, data: Partial<Omit<SavingsGoal, 'id' | 'createdAt'>>) => void;
  deleteSavingsGoal: (id: string) => void;
  addSavingsContribution: (goalId: string, amount: number, note?: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  loadDemoData: () => void;
  clearAllData: () => void;
  importData: (data: BackupData, mode: 'merge' | 'replace') => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  version: 1,
  currency: 'INR',
  defaultMonthlyBudget: 50000,
  enableSatinDecor: true,
  userName: 'Sowparnika P',
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage on initialization (NEVER auto-inserts demo data into user storage)
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, [])
  );
  const [budgets, setBudgets] = useState<Budget[]>(() =>
    loadFromStorage<Budget[]>(STORAGE_KEYS.BUDGETS, [])
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() =>
    loadFromStorage<SavingsGoal[]>(STORAGE_KEYS.SAVINGS_GOALS, [])
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );

  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonthKey());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  }, [transactions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BUDGETS, budgets);
  }, [budgets]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SAVINGS_GOALS, savingsGoals);
  }, [savingsGoals]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // Toast notifications helper
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Find active budget for selected month
  const currentMonthBudget = useMemo(() => {
    return budgets.find(b => b.month === selectedMonth);
  }, [budgets, selectedMonth]);

  // Current month summary
  const currentMonthSummary = useMemo(() => {
    return getMonthlySummary(transactions, currentMonthBudget, selectedMonth);
  }, [transactions, currentMonthBudget, selectedMonth]);

  // Category breakdown for selected month
  const categoryBreakdown = useMemo(() => {
    return getCategoryExpenseBreakdown(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  // Rule-based insights
  const insights = useMemo(() => {
    return generateFinancialInsights(
      currentMonthSummary,
      categoryBreakdown,
      val => formatCurrency(val, settings.currency)
    );
  }, [currentMonthSummary, categoryBreakdown, settings.currency]);

  // Transaction CRUD
  const addTransaction = useCallback((data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    setTransactions(prev => [newTx, ...prev]);
    addToast({
      type: 'success',
      title: 'Transaction Recorded',
      message: `${data.type === 'income' ? 'Income' : 'Expense'} of ${formatCurrency(data.amount, settings.currency)} added.`,
    });
  }, [addToast, settings.currency]);

  const updateTransaction = useCallback((id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
    const now = new Date().toISOString();
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, ...data, updatedAt: now } : tx))
    );
    addToast({
      type: 'success',
      title: 'Transaction Updated',
      message: 'Financial records recalculated successfully.',
    });
  }, [addToast]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    addToast({
      type: 'info',
      title: 'Transaction Deleted',
      message: 'The record has been permanently removed.',
    });
  }, [addToast]);

  // Monthly Budget Management
  const setMonthlyBudget = useCallback((month: string, amount: number) => {
    const now = new Date().toISOString();
    setBudgets(prev => {
      const existingIndex = prev.findIndex(b => b.month === month);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          amount,
          updatedAt: now,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `b-${month}`,
          month,
          amount,
          createdAt: now,
          updatedAt: now,
        },
      ];
    });
    addToast({
      type: 'success',
      title: 'Monthly Budget Saved',
      message: `Budget for ${month} set to ${formatCurrency(amount, settings.currency)}.`,
    });
  }, [addToast, settings.currency]);

  // Category Management
  const addCategory = useCallback((data: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newCategory: Category = { ...data, id, isCustom: true };
    setCategories(prev => [...prev, newCategory]);
    addToast({
      type: 'success',
      title: 'Category Created',
      message: `Category "${data.name}" is now available.`,
    });
  }, [addToast]);

  const updateCategory = useCallback((id: string, data: Partial<Omit<Category, 'id'>>) => {
    const oldCat = categories.find(c => c.id === id);
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...data } : cat))
    );
    // If name changed, optionally update existing transactions with the old category name
    if (data.name && oldCat && oldCat.name !== data.name) {
      setTransactions(prev =>
        prev.map(tx => (tx.category === oldCat.name ? { ...tx, category: data.name! } : tx))
      );
    }
    addToast({
      type: 'success',
      title: 'Category Updated',
      message: 'Changes saved successfully.',
    });
  }, [categories, addToast]);

  const deleteCategory = useCallback((id: string, reassignToCategoryName?: string) => {
    const targetCat = categories.find(c => c.id === id);
    if (!targetCat) return;

    if (reassignToCategoryName) {
      setTransactions(prev =>
        prev.map(tx => (tx.category === targetCat.name ? { ...tx, category: reassignToCategoryName } : tx))
      );
    }

    setCategories(prev => prev.filter(c => c.id !== id));
    addToast({
      type: 'info',
      title: 'Category Removed',
      message: reassignToCategoryName
        ? `Category removed and transactions reassigned to ${reassignToCategoryName}.`
        : 'Category removed.',
    });
  }, [categories, addToast]);

  // Savings Goals Management
  const addSavingsGoal = useCallback((data: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt' | 'contributions'>) => {
    const now = new Date().toISOString();
    const newGoal: SavingsGoal = {
      ...data,
      id: `sg-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      contributions: data.currentAmount > 0 ? [
        {
          id: `sc-init-${Date.now()}`,
          goalId: `sg-${Date.now()}`,
          amount: data.currentAmount,
          date: getTodayDateString(),
          note: 'Initial deposit',
          createdAt: now,
        }
      ] : [],
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    addToast({
      type: 'success',
      title: 'Savings Goal Initiated',
      message: `Goal "${data.title}" created with target ${formatCurrency(data.targetAmount, settings.currency)}.`,
    });
  }, [addToast, settings.currency]);

  const updateSavingsGoal = useCallback((id: string, data: Partial<Omit<SavingsGoal, 'id' | 'createdAt'>>) => {
    const now = new Date().toISOString();
    setSavingsGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, ...data, updatedAt: now } : g))
    );
    addToast({
      type: 'success',
      title: 'Goal Updated',
      message: 'Savings target details adjusted.',
    });
  }, [addToast]);

  const deleteSavingsGoal = useCallback((id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
    addToast({
      type: 'info',
      title: 'Goal Removed',
      message: 'Savings goal has been deleted.',
    });
  }, [addToast]);

  const addSavingsContribution = useCallback((goalId: string, amount: number, note?: string) => {
    const now = new Date().toISOString();
    const today = getTodayDateString();

    setSavingsGoals(prev =>
      prev.map(goal => {
        if (goal.id !== goalId) return goal;
        const newTotal = Math.max(0, goal.currentAmount + amount);
        const newContribution = {
          id: `sc-${Date.now()}`,
          goalId,
          amount,
          date: today,
          note: note || (amount > 0 ? 'Savings deposit' : 'Withdrawal'),
          createdAt: now,
        };
        return {
          ...goal,
          currentAmount: newTotal,
          updatedAt: now,
          contributions: [newContribution, ...(goal.contributions || [])],
        };
      })
    );

    addToast({
      type: 'success',
      title: amount >= 0 ? 'Contribution Recorded' : 'Withdrawal Recorded',
      message: `${formatCurrency(Math.abs(amount), settings.currency)} ${amount >= 0 ? 'allocated towards' : 'withdrawn from'} savings target.`,
    });
  }, [addToast, settings.currency]);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Dashboard settings updated.',
    });
  }, [addToast]);

  // Load Demo Data
  const loadDemoData = useCallback(() => {
    setTransactions(DEMO_TRANSACTIONS);
    setBudgets(DEMO_BUDGETS);
    setCategories(INITIAL_CATEGORIES);
    setSavingsGoals(DEMO_SAVINGS_GOALS);
    setSettings(DEMO_SETTINGS);
    setSelectedMonth('2026-10');
    addToast({
      type: 'success',
      title: 'Demo Data Loaded',
      message: 'Explore Velvet Finance with realistic wealth records across several months.',
    });
  }, [addToast]);

  // Clear All Data
  const clearAllData = useCallback(() => {
    clearAllFinanceStorage();
    setTransactions([]);
    setBudgets([]);
    setCategories(INITIAL_CATEGORIES);
    setSavingsGoals([]);
    setSettings(DEFAULT_SETTINGS);
    addToast({
      type: 'warning',
      title: 'Data Cleared',
      message: 'All local financial records have been reset.',
    });
  }, [addToast]);

  // Import Backup Data
  const importData = useCallback((data: BackupData, mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      setTransactions(data.transactions || []);
      setBudgets(data.budgets || []);
      setCategories(data.categories?.length ? data.categories : INITIAL_CATEGORIES);
      setSavingsGoals(data.savingsGoals || []);
      if (data.settings) setSettings(data.settings);
    } else {
      // Merge mode
      setTransactions(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const newOnes = (data.transactions || []).filter(t => !existingIds.has(t.id));
        return [...newOnes, ...prev];
      });
      setBudgets(prev => {
        const budgetMap = new Map(prev.map(b => [b.month, b]));
        (data.budgets || []).forEach(b => budgetMap.set(b.month, b));
        return Array.from(budgetMap.values());
      });
      setCategories(prev => {
        const catMap = new Map(prev.map(c => [c.name.toLowerCase(), c]));
        (data.categories || []).forEach(c => {
          if (!catMap.has(c.name.toLowerCase())) {
            catMap.set(c.name.toLowerCase(), c);
          }
        });
        return Array.from(catMap.values());
      });
      setSavingsGoals(prev => {
        const goalIds = new Set(prev.map(g => g.id));
        const newGoals = (data.savingsGoals || []).filter(g => !goalIds.has(g.id));
        return [...prev, ...newGoals];
      });
    }

    addToast({
      type: 'success',
      title: 'Import Successful',
      message: `Restored ${data.transactions?.length || 0} transactions via ${mode} mode.`,
    });
  }, [addToast]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        categories,
        savingsGoals,
        settings,
        selectedMonth,
        toasts,
        currentMonthSummary,
        categoryBreakdown,
        insights,
        currentMonthBudget,
        setSelectedMonth,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setMonthlyBudget,
        addCategory,
        updateCategory,
        deleteCategory,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        addSavingsContribution,
        updateSettings,
        loadDemoData,
        clearAllData,
        importData,
        addToast,
        removeToast,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
