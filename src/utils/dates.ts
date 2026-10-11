import { format, parseISO, subMonths, addMonths } from 'date-fns';

/**
 * Returns current month string in YYYY-MM format.
 */
export const getCurrentMonthKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Returns today's date in YYYY-MM-DD format.
 */
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Checks if a transaction belongs to a given month (YYYY-MM).
 */
export const isTransactionInMonth = (txDate: string, monthKey: string): boolean => {
  if (!txDate || !monthKey) return false;
  return txDate.startsWith(monthKey);
};

/**
 * Formats YYYY-MM to human readable "October 2026".
 */
export const formatMonthYear = (monthKey: string): string => {
  if (!monthKey || !monthKey.includes('-')) return monthKey;
  const [yearStr, monthStr] = monthKey.split('-');
  const date = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  return format(date, 'MMMM yyyy');
};

/**
 * Formats YYYY-MM to short "Oct 2026".
 */
export const formatShortMonthYear = (monthKey: string): string => {
  if (!monthKey || !monthKey.includes('-')) return monthKey;
  const [yearStr, monthStr] = monthKey.split('-');
  const date = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  return format(date, 'MMM yyyy');
};

/**
 * Returns the previous month key (e.g. 2026-10 -> 2026-09).
 */
export const getPreviousMonthKey = (monthKey: string): string => {
  const [yearStr, monthStr] = monthKey.split('-');
  const date = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const prevDate = subMonths(date, 1);
  return format(prevDate, 'yyyy-MM');
};

/**
 * Returns the next month key (e.g. 2026-10 -> 2026-11).
 */
export const getNextMonthKey = (monthKey: string): string => {
  const [yearStr, monthStr] = monthKey.split('-');
  const date = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const nextDate = addMonths(date, 1);
  return format(nextDate, 'yyyy-MM');
};

/**
 * Formats a transaction date string (YYYY-MM-DD) for display (e.g. "12 Oct 2026").
 */
export const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return format(date, 'dd MMM yyyy');
  }
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
};

/**
 * Returns a list of consecutive month keys ending at current or specified month.
 */
export const getRecentMonthsList = (targetMonth: string, count: number = 6): string[] => {
  const [yearStr, monthStr] = targetMonth.split('-');
  const baseDate = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const months: string[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const d = subMonths(baseDate, i);
    months.push(format(d, 'yyyy-MM'));
  }

  return months;
};
