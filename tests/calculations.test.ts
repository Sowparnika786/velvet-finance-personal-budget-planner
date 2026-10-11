import { describe, it, expect } from 'vitest';
import {
  calculateMonthlyIncome,
  calculateMonthlyExpenses,
  calculateRemainingBalance,
  calculateRemainingBudget,
  calculateBudgetUtilization,
  calculateSavingsRate,
  getCategoryExpenseBreakdown,
  roundToTwoDecimals,
} from '../src/utils/calculations';
import { Transaction } from '../src/types/finance';

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 100000,
    category: 'Salary',
    description: 'Monthly Salary',
    date: '2026-10-01',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: '2',
    type: 'income',
    amount: 25000,
    category: 'Freelancing',
    description: 'Consulting',
    date: '2026-10-15',
    createdAt: '2026-10-15T00:00:00Z',
    updatedAt: '2026-10-15T00:00:00Z',
  },
  {
    id: '3',
    type: 'expense',
    amount: 30000,
    category: 'Rent & Housing',
    description: 'Rent',
    date: '2026-10-02',
    createdAt: '2026-10-02T00:00:00Z',
    updatedAt: '2026-10-02T00:00:00Z',
  },
  {
    id: '4',
    type: 'expense',
    amount: 15000,
    category: 'Food & Dining',
    description: 'Groceries & Dining',
    date: '2026-10-05',
    createdAt: '2026-10-05T00:00:00Z',
    updatedAt: '2026-10-05T00:00:00Z',
  },
  {
    id: '5',
    type: 'expense',
    amount: 5000,
    category: 'Utilities',
    description: 'Electric & Internet',
    date: '2026-09-28', // Previous month
    createdAt: '2026-09-28T00:00:00Z',
    updatedAt: '2026-09-28T00:00:00Z',
  },
];

describe('Financial Math Calculations', () => {
  it('correctly calculates total income for the specified month', () => {
    const octIncome = calculateMonthlyIncome(sampleTransactions, '2026-10');
    expect(octIncome).toBe(125000);
  });

  it('correctly calculates total expenses for the specified month', () => {
    const octExpenses = calculateMonthlyExpenses(sampleTransactions, '2026-10');
    expect(octExpenses).toBe(45000); // 30000 + 15000, excludes Sept
  });

  it('correctly calculates remaining balance (surplus and deficit)', () => {
    const surplus = calculateRemainingBalance(125000, 45000);
    expect(surplus).toBe(80000);

    const deficit = calculateRemainingBalance(20000, 35000);
    expect(deficit).toBe(-15000);
  });

  it('correctly calculates remaining budget and overspending', () => {
    const remaining = calculateRemainingBudget(50000, 45000);
    expect(remaining).toBe(5000);

    const overspent = calculateRemainingBudget(40000, 45000);
    expect(overspent).toBe(-5000);
  });

  it('correctly calculates budget utilization percentage and prevents division by zero', () => {
    const util = calculateBudgetUtilization(50000, 45000);
    expect(util).toBe(90);

    const zeroBudget = calculateBudgetUtilization(0, 45000);
    expect(zeroBudget).toBe(0);
  });

  it('correctly calculates savings rate based on formula ((Income - Expenses) / Income) * 100', () => {
    const rate = calculateSavingsRate(125000, 45000);
    // (125000 - 45000) / 125000 = 80000 / 125000 = 0.64 = 64%
    expect(rate).toBe(64);

    // Handles zero income safely
    const zeroIncomeRate = calculateSavingsRate(0, 5000);
    expect(zeroIncomeRate).toBe(0);
  });

  it('correctly aggregates category-wise expense breakdown with percentages', () => {
    const breakdown = getCategoryExpenseBreakdown(sampleTransactions, '2026-10');
    expect(breakdown.length).toBe(2);
    expect(breakdown[0].category).toBe('Rent & Housing');
    expect(breakdown[0].amount).toBe(30000);
    expect(breakdown[0].percentage).toBe(66.67); // 30000 / 45000 * 100
    expect(breakdown[1].category).toBe('Food & Dining');
    expect(breakdown[1].amount).toBe(15000);
    expect(breakdown[1].percentage).toBe(33.33);
  });

  it('safely rounds decimal values preventing IEEE 754 precision errors', () => {
    const result = roundToTwoDecimals(0.1 + 0.2);
    expect(result).toBe(0.3);
  });
});
