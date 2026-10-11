import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/currency';
import { formatMonthYear } from '../../utils/dates';
import { getCategoryIcon } from '../../utils/categoryIcons';

const PALETTE = [
  '#701D32', // Secondary burgundy
  '#C7A476', // Muted gold
  '#C58A3D', // Amber
  '#39755C', // Positive green
  '#4A0914', // Primary burgundy
  '#4F6D7A', // Slate blue
  '#9B59B6', // Purple
  '#2E86AB', // Oceanic
  '#806F6B', // Espresso muted
  '#B94A52', // Danger red
  '#2C3E50', // Navy
  '#E67E22', // Orange
];

export const ExpenseDonutChart: React.FC = () => {
  const { categoryBreakdown, categories, selectedMonth, currentMonthSummary, settings } = useFinance();

  const totalExpense = currentMonthSummary.expenses;

  // Resolve color for each category item
  const chartData = categoryBreakdown.map((item, idx) => {
    const foundCat = categories.find(c => c.name.toLowerCase() === item.category.toLowerCase());
    return {
      ...item,
      color: foundCat?.color || PALETTE[idx % PALETTE.length],
      icon: foundCat?.icon || 'Tag',
    };
  });

  return (
    <div className="luxury-card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-burgundy">
            Expense Distribution
          </h3>
          <p className="text-xs text-espresso-muted">
            Category breakdown for {formatMonthYear(selectedMonth)}
          </p>
        </div>
        <span className="text-xs font-semibold text-espresso-muted bg-beige-warm/30 px-2.5 py-1 rounded-full">
          Total: {formatCurrency(totalExpense, settings.currency)}
        </span>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center text-espresso-muted text-xs">
          <p>No expenses recorded for this month.</p>
          <p className="mt-1">Add an expense to view category distribution.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Donut Chart */}
          <div className="h-60 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {chartData.map(entry => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-md border border-beige-champagne rounded-luxury-sm p-2.5 shadow-luxury text-xs">
                          <p className="font-semibold text-burgundy">{data.category}</p>
                          <p className="font-bold text-espresso mt-0.5">
                            {formatCurrency(data.amount, settings.currency)}
                          </p>
                          <p className="text-[11px] text-espresso-muted">
                            {data.percentage}% of spending
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] uppercase tracking-wider text-espresso-muted font-medium">
                Spent
              </span>
              <span className="text-base font-bold text-burgundy font-sans">
                {formatCurrency(totalExpense, settings.currency, { compact: true })}
              </span>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {chartData.map(item => (
              <div
                key={item.category}
                className="flex items-center justify-between text-xs p-2 rounded-luxury-sm hover:bg-beige-warm/20 transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="text-espresso-muted">
                      {getCategoryIcon(item.icon, { className: 'w-3.5 h-3.5 inline' })}
                    </span>
                    <span className="font-medium text-espresso truncate">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-2">
                  <span className="font-semibold text-espresso">
                    {formatCurrency(item.amount, settings.currency)}
                  </span>
                  <span className="text-espresso-muted text-[11px] block">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
