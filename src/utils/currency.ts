import { CurrencyCode } from '../types/finance';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
  },
};

/**
 * Formats a monetary number into styled currency string.
 * Example for INR: ₹1,20,000
 */
export const formatCurrency = (
  amount: number,
  currency: CurrencyCode = 'INR',
  options?: {
    showDecimals?: boolean;
    compact?: boolean;
  }
): string => {
  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.INR;
  const num = Number(amount) || 0;
  const absNum = Math.abs(num);
  const isNegative = num < 0;

  if (options?.compact && absNum >= 1000) {
    if (currency === 'INR') {
      if (absNum >= 10000000) {
        const cr = (absNum / 10000000).toFixed(1).replace(/\.0$/, '');
        return `${isNegative ? '-' : ''}₹${cr} Cr`;
      }
      if (absNum >= 100000) {
        const lakh = (absNum / 100000).toFixed(1).replace(/\.0$/, '');
        return `${isNegative ? '-' : ''}₹${lakh} L`;
      }
      if (absNum >= 1000) {
        const k = (absNum / 1000).toFixed(1).replace(/\.0$/, '');
        return `${isNegative ? '-' : ''}₹${k} k`;
      }
    } else {
      if (absNum >= 1000000) {
        const m = (absNum / 1000000).toFixed(1).replace(/\.0$/, '');
        return `${isNegative ? '-' : ''}${config.symbol}${m}M`;
      }
      if (absNum >= 1000) {
        const k = (absNum / 1000).toFixed(1).replace(/\.0$/, '');
        return `${isNegative ? '-' : ''}${config.symbol}${k}K`;
      }
    }
  }

  // Exact formatting
  const formatted = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: options?.showDecimals ? 2 : 0,
    maximumFractionDigits: options?.showDecimals ? 2 : 0,
  }).format(absNum);

  return isNegative ? `-${formatted}` : formatted;
};

/**
 * Returns currency symbol for active code.
 */
export const getCurrencySymbol = (currency: CurrencyCode = 'INR'): string => {
  return SUPPORTED_CURRENCIES[currency]?.symbol || '₹';
};
