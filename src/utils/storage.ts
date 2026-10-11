export const STORAGE_KEYS = {
  TRANSACTIONS: 'velvet_finance_transactions',
  BUDGETS: 'velvet_finance_budgets',
  CATEGORIES: 'velvet_finance_categories',
  SAVINGS_GOALS: 'velvet_finance_savings_goals',
  SETTINGS: 'velvet_finance_settings',
} as const;

/**
 * Safely loads and parses data from localStorage.
 * If data is missing or corrupted, returns the fallback value.
 */
export const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? (parsed as T) : fallback;
  } catch (error) {
    console.warn(`[Velvet Finance] Error parsing storage item for key "${key}":`, error);
    return fallback;
  }
};

/**
 * Safely stringifies and saves data to localStorage.
 */
export const saveToStorage = <T>(key: string, data: T): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`[Velvet Finance] Error writing to localStorage for key "${key}":`, error);
    return false;
  }
};

/**
 * Removes a specific key from localStorage.
 */
export const removeFromStorage = (key: string): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Velvet Finance] Error removing key "${key}":`, e);
    }
  }
};

/**
 * Clears all Velvet Finance records from localStorage.
 */
export const clearAllFinanceStorage = (): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    Object.values(STORAGE_KEYS).forEach(k => {
      try {
        window.localStorage.removeItem(k);
      } catch (e) {
        console.warn(`[Velvet Finance] Failed to remove ${k}:`, e);
      }
    });
  }
};
