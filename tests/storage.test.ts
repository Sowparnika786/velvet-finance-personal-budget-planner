import { describe, it, expect } from 'vitest';
import { exportTransactionsToCSV, validateBackupData } from '../src/utils/exportImport';
import { Transaction } from '../src/types/finance';

describe('Data Export and Backup Validation', () => {
  const mockTransactions: Transaction[] = [
    {
      id: 'tx-101',
      type: 'expense',
      amount: 4500,
      category: 'Food & Dining',
      description: 'Dinner, Drinks',
      date: '2026-10-10',
      createdAt: '2026-10-10T20:00:00Z',
      updatedAt: '2026-10-10T20:00:00Z',
    },
  ];

  it('generates valid CSV format with headers and quotes', () => {
    const csv = exportTransactionsToCSV(mockTransactions);
    expect(csv).toContain('ID,Date,Type,Category,Description,Amount,Created At');
    expect(csv).toContain('"tx-101"');
    expect(csv).toContain('"Dinner, Drinks"');
    expect(csv).toContain('4500.00');
  });

  it('validates authentic Velvet Finance backup JSON data', () => {
    const validPayload = {
      version: 1,
      source: 'Velvet Finance',
      exportedAt: new Date().toISOString(),
      transactions: mockTransactions,
      budgets: [],
      categories: [],
      savingsGoals: [],
      settings: {
        version: 1,
        currency: 'INR',
        defaultMonthlyBudget: 50000,
        enableSatinDecor: true,
        userName: 'Sowparnika P',
      },
    };

    const validation = validateBackupData(validPayload);
    expect(validation.isValid).toBe(true);
    expect(validation.counts.transactions).toBe(1);
    expect(validation.errors.length).toBe(0);
  });

  it('rejects invalid or corrupted backup payloads gracefully', () => {
    const invalidPayload = {
      randomField: 'nonsense',
    };

    const validation = validateBackupData(invalidPayload);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});
