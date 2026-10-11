import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { FinancialInsight } from '../../types/finance';

export const InsightsCard: React.FC = () => {
  const { insights } = useFinance();

  const getInsightIcon = (type: FinancialInsight['type']) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="w-5 h-5 text-danger" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-positive" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-gold" />;
    }
  };

  const getCardBg = (type: FinancialInsight['type']) => {
    switch (type) {
      case 'alert':
        return 'border-danger/30 bg-danger-light/50';
      case 'warning':
        return 'border-warning/30 bg-warning-light/50';
      case 'success':
        return 'border-positive/30 bg-positive-light/50';
      case 'info':
      default:
        return 'border-beige-champagne/60 bg-beige-ivory/50';
    }
  };

  return (
    <div className="luxury-card p-6 flex flex-col justify-between">
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-gold-dark" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-burgundy">
            Financial Intelligence
          </h3>
          <p className="text-xs text-espresso-muted">
            Automated health metrics and rule-based observations
          </p>
        </div>
      </div>

      {insights.length === 0 ? (
        <p className="text-xs text-espresso-muted py-4">
          Record more financial transactions to generate tailored intelligence insights.
        </p>
      ) : (
        <div className="space-y-3">
          {insights.map(item => (
            <div
              key={item.id}
              className={`p-3.5 rounded-luxury-sm border flex items-start space-x-3 transition-colors ${getCardBg(
                item.type
              )}`}
            >
              <div className="flex-shrink-0 mt-0.5">{getInsightIcon(item.type)}</div>
              <div>
                <h4 className="text-xs font-bold text-espresso uppercase tracking-wider font-sans">
                  {item.title}
                </h4>
                <p className="text-xs text-espresso-muted mt-0.5 leading-relaxed font-sans">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
