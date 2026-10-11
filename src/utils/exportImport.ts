import { Transaction, Budget, Category, SavingsGoal, AppSettings } from '../types/finance';

export interface BackupData {
  version: number;
  exportedAt: string;
  source: string;
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  savingsGoals: SavingsGoal[];
  settings: AppSettings;
}

export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  counts: {
    transactions: number;
    budgets: number;
    categories: number;
    savingsGoals: number;
  };
  data?: BackupData;
}

/**
 * Converts transactions array into a formatted CSV string.
 */
export const exportTransactionsToCSV = (transactions: Transaction[]): string => {
  const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Created At'];
  const rows = transactions.map(tx => [
    `"${tx.id}"`,
    `"${tx.date}"`,
    `"${tx.type}"`,
    `"${(tx.category || '').replace(/"/g, '""')}"`,
    `"${(tx.description || '').replace(/"/g, '""')}"`,
    tx.amount.toFixed(2),
    `"${tx.createdAt}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
};

/**
 * Triggers a browser download of text data (CSV or JSON).
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Validates parsed backup JSON data.
 */
export const validateBackupData = (raw: unknown): ImportValidationResult => {
  const errors: string[] = [];

  if (!raw || typeof raw !== 'object') {
    return {
      isValid: false,
      errors: ['File content is not a valid JSON object.'],
      counts: { transactions: 0, budgets: 0, categories: 0, savingsGoals: 0 },
    };
  }

  const obj = raw as Partial<BackupData>;

  if (obj.source !== 'Velvet Finance' && !Array.isArray(obj.transactions)) {
    errors.push('File does not appear to be a Velvet Finance backup.');
  }

  const transactions = Array.isArray(obj.transactions) ? obj.transactions : [];
  const budgets = Array.isArray(obj.budgets) ? obj.budgets : [];
  const categories = Array.isArray(obj.categories) ? obj.categories : [];
  const savingsGoals = Array.isArray(obj.savingsGoals) ? obj.savingsGoals : [];

  // Validate transactions
  const validTransactions = transactions.filter(t => (
    t &&
    typeof t.id === 'string' &&
    (t.type === 'income' || t.type === 'expense') &&
    typeof t.amount === 'number' &&
    typeof t.date === 'string'
  ));

  if (transactions.length > 0 && validTransactions.length === 0) {
    errors.push('No valid transaction records found in the backup file.');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    counts: {
      transactions: validTransactions.length,
      budgets: budgets.length,
      categories: categories.length,
      savingsGoals: savingsGoals.length,
    },
    data: isValid ? (raw as BackupData) : undefined,
  };
};
