import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { formatMonthYear } from '../../utils/dates';
import { PiggyBank } from 'lucide-react';

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMonth?: string;
}

export const SetBudgetModal: React.FC<SetBudgetModalProps> = ({
  isOpen,
  onClose,
  targetMonth,
}) => {
  const { selectedMonth, budgets, setMonthlyBudget, settings } = useFinance();
  const activeMonth = targetMonth || selectedMonth;

  const existingBudget = budgets.find(b => b.month === activeMonth);

  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (existingBudget) {
      setAmount(String(existingBudget.amount));
    } else {
      setAmount(settings.defaultMonthlyBudget ? String(settings.defaultMonthlyBudget) : '');
    }
    setError('');
  }, [existingBudget, activeMonth, isOpen, settings.defaultMonthlyBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please specify a positive budget limit.');
      return;
    }

    setMonthlyBudget(activeMonth, val);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Establish Monthly Budget"
      subtitle={`Configure overall spending cap for ${formatMonthYear(activeMonth)}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-beige-ivory rounded-luxury-sm border border-beige-champagne/60">
          <div className="w-10 h-10 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center flex-shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-espresso-muted">Target Month</p>
            <p className="text-sm font-serif font-bold text-burgundy">
              {formatMonthYear(activeMonth)}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Budget Amount ({settings.currency}) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 50000"
            value={amount}
            onChange={e => {
              setAmount(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-semibold font-sans text-base transition-colors bg-white"
          />
          {error && <p className="text-xs text-danger mt-1 font-medium">{error}</p>}
        </div>

        <div className="flex items-center space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-luxury-sm border border-beige-champagne text-espresso font-medium text-sm hover:bg-beige-warm/30 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            Save Budget
          </button>
        </div>
      </form>
    </Modal>
  );
};
