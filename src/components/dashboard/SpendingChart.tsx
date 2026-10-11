import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { getRecentMonthsList, formatShortMonthYear } from '../../utils/dates';
import { calculateMonthlyIncome, calculateMonthlyExpenses } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currency';

export const SpendingChart: React.FC = () => {
  const { transactions, selectedMonth, settings } = useFinance();

  const chartData = useMemo(() => {
    const recentMonths = getRecentMonthsList(selectedMonth, 6);

    return recentMonths.map(m => {
      const inc = calculateMonthlyIncome(transactions, m);
      const exp = calculateMonthlyExpenses(transactions, m);
      return {
        monthKey: m,
        name: formatShortMonthYear(m),
        income: inc,
        expenses: exp,
      };
    });
  }, [transactions, selectedMonth]);

  const hasData = chartData.some(d => d.income > 0 || d.expenses > 0);

  return (
    <div className="luxury-card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-burgundy">
            Monthly Spending Comparison
          </h3>
          <p className="text-xs text-espresso-muted">
            Income vs Expenses across the last 6 months
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-center text-espresso-muted text-xs">
          <p>No transactions recorded in the last 6 months.</p>
          <p className="mt-1">Add transactions or load demo data to view charts.</p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8D8C3" opacity={0.6} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#806F6B', fontSize: 11 }}
                axisLine={{ stroke: '#D8C3A5', opacity: 0.5 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#806F6B', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={val => formatCurrency(val, settings.currency, { compact: true })}
              />
              <Tooltip
                cursor={{ fill: 'rgba(216, 195, 165, 0.15)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-md border border-beige-champagne rounded-luxury-sm p-3 shadow-luxury text-xs">
                        <p className="font-serif font-bold text-burgundy mb-1.5">{label}</p>
                        <div className="space-y-1">
                          <p className="text-positive font-medium flex items-center justify-between space-x-4">
                            <span>Income:</span>
                            <span className="font-semibold">
                              {formatCurrency(Number(payload[0]?.value || 0), settings.currency)}
                            </span>
                          </p>
                          <p className="text-burgundy-secondary font-medium flex items-center justify-between space-x-4">
                            <span>Expenses:</span>
                            <span className="font-semibold">
                              {formatCurrency(Number(payload[1]?.value || 0), settings.currency)}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
                formatter={value => (
                  <span className="text-xs text-espresso font-medium capitalize">{value}</span>
                )}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#39755C"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#701D32"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
