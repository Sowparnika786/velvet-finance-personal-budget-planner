import { describe, it, expect } from 'vitest';
import { formatCurrency, getCurrencySymbol } from '../src/utils/currency';

describe('Currency and Internationalization Formatting', () => {
  it('formats INR using Indian number grouping (lakhs/crores)', () => {
    const formatted5k = formatCurrency(5000, 'INR');
    expect(formatted5k).toContain('5,000');
    expect(formatted5k).toContain('₹');

    const formattedLakh = formatCurrency(120000, 'INR');
    expect(formattedLakh).toContain('1,20,000');
    expect(formattedLakh).toContain('₹');
  });

  it('handles negative currency values clearly with a minus sign', () => {
    const negativeValue = formatCurrency(-15000, 'INR');
    expect(negativeValue.startsWith('-')).toBe(true);
    expect(negativeValue).toContain('15,000');
    expect(negativeValue).toContain('₹');
  });

  it('supports compact formatting for large denominations', () => {
    const compactLakh = formatCurrency(250000, 'INR', { compact: true });
    expect(compactLakh).toContain('2.5 L');

    const compactThousand = formatCurrency(45000, 'INR', { compact: true });
    expect(compactThousand).toContain('45 k');
  });

  it('formats other supported currencies (USD, EUR, GBP)', () => {
    const usd = formatCurrency(1000, 'USD');
    expect(usd).toContain('$1,000');

    const gbp = formatCurrency(1000, 'GBP');
    expect(gbp).toContain('£1,000');
  });

  it('provides correct currency symbol lookup', () => {
    expect(getCurrencySymbol('INR')).toBe('₹');
    expect(getCurrencySymbol('USD')).toBe('$');
    expect(getCurrencySymbol('EUR')).toBe('€');
    expect(getCurrencySymbol('GBP')).toBe('£');
  });
});
