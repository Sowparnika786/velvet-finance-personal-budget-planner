import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { SavingsGoal } from '../../types/finance';
import { formatCurrency } from '../../utils/currency';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface GoalContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
}

export const GoalContributionModal: React.FC<GoalContributionModalProps> = ({
  isOpen,
  onClose,
  goal,
}) => {
  const { addSavingsContribution, settings } = useFinance();

  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please provide a valid contribution amount.');
      return;
    }

    if (mode === 'withdraw' && val > goal.currentAmount) {
      setError(`Cannot withdraw more than current savings (${formatCurrency(goal.currentAmount, settings.currency)}).`);
      return;
    }

    const delta = mode === 'deposit' ? val : -val;
    addSavingsContribution(goal.id, delta, note.trim() || undefined);
    setAmount('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Goal Progress"
      subtitle={`Adjust accumulated reserve for "${goal.title}"`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode Toggle: Deposit vs Withdraw */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('deposit')}
            className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-luxury-sm text-xs font-semibold border transition-all ${
              mode === 'deposit'
                ? 'bg-positive text-white border-positive shadow-sm'
                : 'bg-white text-espresso-muted border-beige-champagne'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Deposit</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('withdraw')}
            className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-luxury-sm text-xs font-semibold border transition-all ${
              mode === 'withdraw'
                ? 'bg-danger text-white border-danger shadow-sm'
                : 'bg-white text-espresso-muted border-beige-champagne'
            }`}
          >
            <MinusCircle className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Amount ({settings.currency}) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={e => {
              setAmount(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-semibold text-base bg-white"
          />
          {error && <p className="text-xs text-danger mt-1 font-medium">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Memo Note (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. October surplus allocation, bonus"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-medium text-sm bg-white"
          />
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
            Confirm {mode === 'deposit' ? 'Deposit' : 'Withdrawal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
