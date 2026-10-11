import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Percent,
  Calculator,
  Crown,
  PiggyBank,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import {
  calculateMonthlyIncome,
  calculateMonthlyExpenses,
  getCategoryExpenseBreakdown,
  calculateSavingsRate,
  calculateRemainingBalance,
  roundToTwoDecimals,
} from '../utils/calculations';
import { getRecentMonthsList, formatMonthYear, formatShortMonthYear } from '../utils/dates';
import { formatCurrency } from '../utils/currency';
import { StatCard } from '../components/common/StatCard';
import { Transaction } from '../types/finance';

export const AnalyticsPage: React.FC = () => {
  const { transactions, selectedMonth, currentMonthSummary, settings } = useFinance();

  const [trendMonthCount, setTrendMonthCount] = useState<number>(6);

  // 6-Month Trend Data
  const trendData = useMemo(() => {
    const months = getRecentMonthsList(selectedMonth, trendMonthCount);
    return months.map(m => {
      const inc = calculateMonthlyIncome(transactions, m);
      const exp = calculateMonthlyExpenses(transactions, m);
      const bal = calculateRemainingBalance(inc, exp);
      const rate = calculateSavingsRate(inc, exp);

      return {
        monthKey: m,
        name: formatShortMonthYear(m),
        income: inc,
        expenses: exp,
        savings: Math.max(0, bal),
        savingsRate: rate,
      };
    });
  }, [transactions, selectedMonth, trendMonthCount]);

  // Average Monthly Expenses across all months with records
  const averageMonthlyExpenses = useMemo(() => {
    const expenseMonths = new Map<string, number>();
    transactions
      .filter((t: Transaction) => t.type === 'expense')
      .forEach((t: Transaction) => {
        const m = t.date.slice(0, 7);
        expenseMonths.set(m, (expenseMonths.get(m) || 0) + t.amount);
      });

    if (expenseMonths.size === 0) return 0;
    const total = Array.from(expenseMonths.values()).reduce((sum, v) => sum + v, 0);
    return roundToTwoDecimals(total / expenseMonths.size);
  }, [transactions]);

  // Category breakdown for selected month
  const categoryBreakdown = useMemo(() => {
    return getCategoryExpenseBreakdown(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  const topCategory = categoryBreakdown[0];

  const hasData = trendData.some(d => d.income > 0 || d.expenses > 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Savings Rate */}
        <StatCard
          title="Savings Rate"
          amount={`${currentMonthSummary.savingsRate}%`}
          subtitle={`Formula: ((In - Out) / In) × 100`}
          icon={Percent}
          iconBgColor="bg-positive-light"
          iconColor="text-positive"
          trendText={currentMonthSummary.savingsRate >= 20 ? 'Benchmark Exceeded' : 'Under 20%'}
          trendType={currentMonthSummary.savingsRate >= 20 ? 'positive' : 'warning'}
          progress={Math.max(0, currentMonthSummary.savingsRate)}
          progressColor="bg-positive"
        />

        {/* Monthly Net Savings */}
        <StatCard
          title="Monthly Net Savings"
          amount={formatCurrency(currentMonthSummary.balance, settings.currency)}
          subtitle={formatMonthYear(selectedMonth)}
          icon={PiggyBank}
          iconBgColor="bg-gold/20"
          iconColor="text-gold-dark"
          trendText={currentMonthSummary.balance >= 0 ? 'Surplus Reserve' : 'Deficit Outflow'}
          trendType={currentMonthSummary.balance >= 0 ? 'positive' : 'danger'}
        />

        {/* Average Monthly Expenses */}
        <StatCard
          title="Average Monthly Outflows"
          amount={formatCurrency(averageMonthlyExpenses, settings.currency)}
          subtitle="Across all active months"
          icon={Calculator}
          iconBgColor="bg-beige-warm/40"
          iconColor="text-burgundy"
          trendText="Historical Average"
          trendType="neutral"
        />

        {/* Highest Spending Category */}
        <StatCard
          title="Highest Expense Category"
          amount={topCategory ? topCategory.category : 'None'}
          subtitle={
            topCategory
              ? `${formatCurrency(topCategory.amount, settings.currency)} (${topCategory.percentage}%)`
              : 'No expenses logged'
          }
          icon={Crown}
          iconBgColor="bg-danger-light"
          iconColor="text-burgundy"
          trendText={topCategory ? `${topCategory.percentage}% of Outflow` : 'N/A'}
          trendType={topCategory ? 'warning' : 'neutral'}
        />
      </div>

      {/* 6-Month Spending Trend Line / Area Chart */}
      <div className="luxury-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-burgundy">
              Spending & Savings Flow Trend
            </h3>
            <p className="text-xs text-espresso-muted">
              Continuous trend line illustrating cash flow trajectories over time
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {[3, 6, 12].map(months => (
              <button
                key={months}
                onClick={() => setTrendMonthCount(months)}
                className={`px-3 py-1.5 rounded-luxury-sm text-xs font-semibold transition-all ${
                  trendMonthCount === months
                    ? 'bg-burgundy text-beige-champagne shadow-sm'
                    : 'bg-beige-warm/30 text-espresso hover:bg-beige-warm/50'
                }`}
              >
                {months} Months
              </button>
            ))}
          </div>
        </div>

        {!hasData ? (
          <div className="h-72 flex flex-col items-center justify-center text-center text-espresso-muted text-xs">
            <p>Insufficient transaction data to graph trends.</p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39755C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#39755C" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#701D32" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#701D32" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
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
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-md border border-beige-champagne rounded-luxury-sm p-3 shadow-luxury text-xs">
                          <p className="font-serif font-bold text-burgundy mb-1.5">{label}</p>
                          <div className="space-y-1">
                            <p className="text-positive font-semibold flex justify-between space-x-4">
                              <span>Income:</span>
                              <span>{formatCurrency(Number(payload[0]?.value || 0), settings.currency)}</span>
                            </p>
                            <p className="text-burgundy-secondary font-semibold flex justify-between space-x-4">
                              <span>Expenses:</span>
                              <span>{formatCurrency(Number(payload[1]?.value || 0), settings.currency)}</span>
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
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#39755C"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#701D32"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Two Column Grid: Category Breakdown & Inflow vs Outflow Ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Table */}
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-beige-warm/60">
            <div>
              <h3 className="font-serif font-bold text-base text-burgundy">
                Category Ranking
              </h3>
              <p className="text-xs text-espresso-muted">
                Expenses ranked by volume for {formatMonthYear(selectedMonth)}
              </p>
            </div>
          </div>

          {categoryBreakdown.length === 0 ? (
            <p className="text-xs text-espresso-muted py-8 text-center">
              No expenses recorded for this month.
            </p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {categoryBreakdown.map((item, idx) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-espresso flex items-center space-x-1.5">
                      <span className="w-4 text-espresso-muted font-normal text-[11px]">{idx + 1}.</span>
                      <span>{item.category}</span>
                    </span>
                    <span className="font-bold text-burgundy">
                      {formatCurrency(item.amount, settings.currency)}{' '}
                      <span className="text-espresso-muted font-normal">({item.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-beige-ivory rounded-full h-2 overflow-hidden border border-beige-champagne/30">
                    <div
                      className="h-full bg-burgundy rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Savings Discipline Summary Card */}
        <div className="luxury-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-burgundy mb-1">
              Wealth Accumulation Metrics
            </h3>
            <p className="text-xs text-espresso-muted mb-4">
              Structural analysis of your cash flow retention for {formatMonthYear(selectedMonth)}
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-luxury-sm bg-beige-ivory border border-beige-champagne/60 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-espresso-muted font-semibold">
                    Inflow / Outflow Ratio
                  </p>
                  <p className="text-base font-bold text-espresso font-sans mt-0.5">
                    {currentMonthSummary.expenses > 0
                      ? `${(currentMonthSummary.income / currentMonthSummary.expenses).toFixed(2)}x Coverage`
                      : 'Infinite (Zero Expenses)'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-positive font-semibold">
                    Surplus: {formatCurrency(Math.max(0, currentMonthSummary.balance), settings.currency)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-luxury-sm bg-beige-ivory border border-beige-champagne/60 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-espresso-muted font-semibold">
                    Monthly Budget Allocation Pacing
                  </p>
                  <p className="text-base font-bold text-espresso font-sans mt-0.5">
                    {currentMonthSummary.hasBudget
                      ? `${currentMonthSummary.budgetUsedPercent}% Utilized`
                      : 'Unbudgeted'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-espresso-muted">
                    Cap: {formatCurrency(currentMonthSummary.budget, settings.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-luxury-sm bg-gold/15 border border-gold/40 mt-6 text-xs text-espresso">
            <span className="font-bold text-burgundy">Fintech Principle:</span> High-net-worth wealth retention aims for an ongoing savings rate above 20%. Velvet Finance continuously calculates this as <code className="bg-white/70 px-1 py-0.5 rounded text-[11px]">((Inflows - Outflows) / Inflows) * 100</code>.
          </div>
        </div>
      </div>
    </div>
  );
};
