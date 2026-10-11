import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownLeft,
  FileSpreadsheet,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Transaction, TransactionType, TransactionSort } from '../types/finance';
import { formatCurrency } from '../utils/currency';
import { formatDisplayDate, formatMonthYear } from '../utils/dates';
import { getCategoryIcon } from '../utils/categoryIcons';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { exportTransactionsToCSV, downloadFile } from '../utils/exportImport';

interface TransactionsPageProps {
  onOpenAddTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  onOpenAddTransaction,
  onEditTransaction,
}) => {
  const { transactions, categories, deleteTransaction, selectedMonth, settings } = useFinance();

  // Filters state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>(selectedMonth);
  const [sortBy, setSortBy] = useState<TransactionSort>('date-desc');

  // Deletion modal state
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);

  // Unique months present in transactions
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t: Transaction) => {
      if (t.date && t.date.length >= 7) {
        set.add(t.date.slice(0, 7));
      }
    });
    set.add(selectedMonth);
    return Array.from(set).sort().reverse();
  }, [transactions, selectedMonth]);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx: Transaction) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesDesc = (tx.description || '').toLowerCase().includes(q);
        const matchesCat = (tx.category || '').toLowerCase().includes(q);
        if (!matchesDesc && !matchesCat) return false;
      }
      // Type
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      // Category
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;
      // Month
      if (monthFilter !== 'all' && !tx.date.startsWith(monthFilter)) return false;

      return true;
    }).sort((a: Transaction, b: Transaction) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [transactions, search, typeFilter, categoryFilter, monthFilter, sortBy]);

  const handleExportCSV = () => {
    const csv = exportTransactionsToCSV(filteredTransactions);
    downloadFile(csv, `velvet-finance-transactions-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls Bar */}
      <div className="luxury-card p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
            <input
              type="text"
              placeholder="Search by description or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-sm text-espresso bg-white"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2.5 self-end md:self-auto">
            <button
              onClick={handleExportCSV}
              disabled={filteredTransactions.length === 0}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-luxury-sm border border-beige-champagne hover:bg-beige-warm/30 text-xs font-semibold text-espresso transition-colors disabled:opacity-40"
              title="Export visible transactions to CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-burgundy" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenAddTransaction}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne text-xs font-semibold transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Record</span>
            </button>
          </div>
        </div>

        {/* Filter & Sort Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-beige-warm/40">
          {/* Type Filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-espresso-muted mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-luxury-sm border border-beige-champagne text-xs font-medium text-espresso bg-white outline-none focus:border-burgundy"
            >
              <option value="all">All Types</option>
              <option value="expense">Expense Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-espresso-muted mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-luxury-sm border border-beige-champagne text-xs font-medium text-espresso bg-white outline-none focus:border-burgundy"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-espresso-muted mb-1">
              Month Scope
            </label>
            <select
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-luxury-sm border border-beige-champagne text-xs font-medium text-espresso bg-white outline-none focus:border-burgundy"
            >
              <option value="all">All Time</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>
                  {formatMonthYear(m)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-espresso-muted mb-1">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-luxury-sm border border-beige-champagne text-xs font-medium text-espresso bg-white outline-none focus:border-burgundy"
            >
              <option value="date-desc">Newest Date First</option>
              <option value="date-asc">Oldest Date First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List Table */}
      <div className="luxury-card overflow-hidden">
        <div className="px-6 py-4 border-b border-beige-warm/60 flex items-center justify-between bg-beige-ivory/40">
          <h3 className="font-serif font-bold text-base text-burgundy">
            Transactions ({filteredTransactions.length})
          </h3>
          <span className="text-xs text-espresso-muted">
            {monthFilter === 'all' ? 'All recorded transactions' : formatMonthYear(monthFilter)}
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-espresso-muted">
            <Filter className="w-10 h-10 text-beige-champagne mx-auto mb-2" />
            <h4 className="font-serif font-bold text-espresso text-base mb-1">
              No transactions match your criteria
            </h4>
            <p className="text-xs max-w-sm mx-auto mb-4">
              Try adjusting your search terms, clearing filters, or adding a new transaction record.
            </p>
            <button
              onClick={onOpenAddTransaction}
              className="px-4 py-2 rounded-luxury-sm bg-burgundy text-beige-champagne text-xs font-semibold hover:bg-burgundy-hover transition-colors"
            >
              + Record Transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-beige-champagne/40 text-[11px] uppercase font-semibold text-espresso-muted bg-beige-ivory/60">
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Description & Memo</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  <th className="py-3 px-6 text-center">Type</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-warm/30 text-xs text-espresso">
                {filteredTransactions.map(tx => {
                  const isIncome = tx.type === 'income';
                  const cat = categories.find(c => c.name === tx.category);

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-beige-warm/15 transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-6 whitespace-nowrap font-medium text-espresso-muted">
                        {formatDisplayDate(tx.date)}
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-6 font-semibold text-espresso max-w-xs truncate">
                        {tx.description || <span className="text-espresso-muted italic font-normal">No description</span>}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-beige-ivory border border-beige-champagne/60 text-espresso text-[11px] font-medium">
                          {cat?.icon && (
                            <span className="text-burgundy">
                              {getCategoryIcon(cat.icon, { className: 'w-3 h-3' })}
                            </span>
                          )}
                          <span>{tx.category}</span>
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-6 text-right whitespace-nowrap font-sans font-bold text-sm">
                        <span className={isIncome ? 'text-positive' : 'text-burgundy-secondary'}>
                          {isIncome ? '+' : '-'}
                          {formatCurrency(tx.amount, settings.currency)}
                        </span>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-6 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isIncome
                              ? 'bg-positive-light text-positive border-positive/30'
                              : 'bg-danger-light text-danger border-danger/30'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownLeft className="w-3 h-3" />
                          )}
                          <span>{tx.type}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1.5 rounded-lg text-espresso-muted hover:text-burgundy hover:bg-beige-warm/30 transition-colors"
                            title="Edit transaction"
                            aria-label="Edit transaction"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setTxToDelete(tx)}
                            className="p-1.5 rounded-lg text-espresso-muted hover:text-danger hover:bg-danger-light transition-colors"
                            title="Delete transaction"
                            aria-label="Delete transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={() => {
          if (txToDelete) {
            deleteTransaction(txToDelete.id);
            setTxToDelete(null);
          }
        }}
        title="Delete Transaction"
        message={`Are you sure you want to delete this ${txToDelete?.type} of ${
          txToDelete ? formatCurrency(txToDelete.amount, settings.currency) : ''
        }? This action will permanently recalculate all monthly summaries.`}
        confirmText="Delete Record"
        isDestructive={true}
      />
    </div>
  );
};
