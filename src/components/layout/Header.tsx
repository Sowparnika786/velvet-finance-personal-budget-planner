import React from 'react';
import {
  Menu,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { PageId } from './Sidebar';
import {
  formatMonthYear,
  getPreviousMonthKey,
  getNextMonthKey,
} from '../../utils/dates';

interface HeaderProps {
  activePage: PageId;
  onOpenMobileMenu: () => void;
  onOpenAddTransaction: () => void;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Financial Overview',
    subtitle: 'Track your wealth flow and budget efficiency at a glance',
  },
  transactions: {
    title: 'Transaction Ledger',
    subtitle: 'Manage and categorize your personal income and expenditures',
  },
  budget: {
    title: 'Monthly Budgeting',
    subtitle: 'Set spending limits and prevent overspending across months',
  },
  categories: {
    title: 'Custom Categories',
    subtitle: 'Organize your cash flow with tailored income and expense tags',
  },
  analytics: {
    title: 'Financial Analytics',
    subtitle: 'Deep-dive into spending trends, distribution, and savings rate',
  },
  savings: {
    title: 'Savings & Targets',
    subtitle: 'Build your reserves and fund aspirational life milestones',
  },
  settings: {
    title: 'Platform Settings',
    subtitle: 'Manage currency, storage backups, and account preferences',
  },
};

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onOpenMobileMenu,
  onOpenAddTransaction,
}) => {
  const { selectedMonth, setSelectedMonth, transactions, loadDemoData, settings } = useFinance();
  const pageInfo = PAGE_TITLES[activePage];

  const handlePrevMonth = () => {
    setSelectedMonth(getPreviousMonthKey(selectedMonth));
  };

  const handleNextMonth = () => {
    setSelectedMonth(getNextMonthKey(selectedMonth));
  };

  return (
    <header className="sticky top-0 z-30 bg-beige-ivory/90 backdrop-blur-md border-b border-beige-champagne/40 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Mobile Menu Trigger + Page Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-burgundy hover:bg-beige-warm/40 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-burgundy tracking-tight">
            {pageInfo.title}
          </h2>
          <p className="text-xs text-espresso-muted hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Month Selector + Actions */}
      <div className="flex items-center space-x-2.5 sm:space-x-4">
        {/* Month Selector Pill */}
        <div className="flex items-center bg-white border border-beige-champagne/80 rounded-luxury-sm p-1 shadow-sm">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-md text-espresso-muted hover:text-burgundy hover:bg-beige-warm/30 transition-colors"
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1.5 px-2 py-0.5 text-xs font-semibold text-espresso">
            <Calendar className="w-3.5 h-3.5 text-burgundy hidden sm:inline" />
            <span className="whitespace-nowrap font-sans">
              {formatMonthYear(selectedMonth)}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-1 rounded-md text-espresso-muted hover:text-burgundy hover:bg-beige-warm/30 transition-colors"
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Load Demo Data Button if empty or requested */}
        {transactions.length === 0 && (
          <button
            onClick={loadDemoData}
            className="hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-luxury-sm bg-gold/15 text-gold-dark hover:bg-gold/25 border border-gold/40 text-xs font-semibold transition-all shadow-sm"
            title="Populate dashboard with realistic Indian sample data"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Load Demo Data</span>
          </button>
        )}

        {/* Add Transaction CTA */}
        <button
          onClick={onOpenAddTransaction}
          className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* User Monogram Avatar */}
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-burgundy to-burgundy-secondary text-gold font-serif font-bold text-xs flex items-center justify-center border-2 border-beige-champagne/60 shadow-sm cursor-pointer"
          title={`User: ${settings.userName}`}
        >
          {settings.userName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'VF'}
        </div>
      </div>
    </header>
  );
};
