import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ArrowRight, Clock } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/currency';
import { formatDisplayDate, isTransactionInMonth } from '../../utils/dates';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface RecentTransactionsProps {
  onViewAllClick: () => void;
  onOpenAddTransaction: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  onViewAllClick,
  onOpenAddTransaction,
}) => {
  const { transactions, categories, selectedMonth, settings } = useFinance();

  // Filter transactions for selected month, take newest 5
  const monthlyTransactions = transactions.filter(tx =>
    isTransactionInMonth(tx.date, selectedMonth)
  );

  const recent = [...monthlyTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="luxury-card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-burgundy">
            Recent Transactions
          </h3>
          <p className="text-xs text-espresso-muted">
            Latest entries recorded for this month
          </p>
        </div>

        {recent.length > 0 && (
          <button
            onClick={onViewAllClick}
            className="flex items-center space-x-1 text-xs font-semibold text-burgundy hover:text-burgundy-light transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center text-espresso-muted">
          <Clock className="w-8 h-8 text-beige-champagne mb-2" />
          <p className="text-xs">No transactions logged for this month yet.</p>
          <button
            onClick={onOpenAddTransaction}
            className="mt-3 text-xs font-semibold text-burgundy hover:underline"
          >
            + Add First Transaction
          </button>
        </div>
      ) : (
        <div className="divide-y divide-beige-warm/40">
          {recent.map(tx => {
            const isIncome = tx.type === 'income';
            const cat = categories.find(c => c.name === tx.category);

            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between hover:bg-beige-warm/15 px-1 rounded-md transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-luxury-sm flex items-center justify-center flex-shrink-0 ${
                      isIncome ? 'bg-positive-light text-positive' : 'bg-beige-warm/40 text-burgundy'
                    }`}
                  >
                    {cat?.icon ? (
                      getCategoryIcon(cat.icon, { className: 'w-4 h-4' })
                    ) : isIncome ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-espresso truncate">
                      {tx.description || tx.category}
                    </p>
                    <div className="flex items-center space-x-2 text-[11px] text-espresso-muted">
                      <span>{formatDisplayDate(tx.date)}</span>
                      <span>•</span>
                      <span className="truncate">{tx.category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-3">
                  <p
                    className={`text-xs sm:text-sm font-bold font-sans ${
                      isIncome ? 'text-positive' : 'text-burgundy-secondary'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, settings.currency)}
                  </p>
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                      isIncome ? 'bg-positive-light text-positive' : 'bg-danger-light text-danger'
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
