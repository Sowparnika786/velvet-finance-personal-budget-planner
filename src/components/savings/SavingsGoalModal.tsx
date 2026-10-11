import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { SavingsGoal } from '../../types/finance';

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: SavingsGoal | null;
}

export const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
}) => {
  const { addSavingsGoal, updateSavingsGoal, settings } = useFinance();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Emergency Reserve');
  const [error, setError] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setTargetAmount(String(goalToEdit.targetAmount));
      setInitialAmount(String(goalToEdit.currentAmount));
      setTargetDate(goalToEdit.targetDate);
      setCategory(goalToEdit.category || 'General Savings');
    } else {
      setTitle('');
      setTargetAmount('');
      setInitialAmount('0');
      // Default to 6 months from now
      const d = new Date();
      d.setMonth(d.getMonth() + 6);
      setTargetDate(d.toISOString().slice(0, 10));
      setCategory('Emergency Reserve');
    }
    setError('');
  }, [goalToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const initial = parseFloat(initialAmount) || 0;

    if (!title.trim()) {
      setError('Please provide a goal title.');
      return;
    }
    if (isNaN(target) || target <= 0) {
      setError('Target amount must be greater than zero.');
      return;
    }
    if (!targetDate) {
      setError('Please select a target deadline.');
      return;
    }

    if (goalToEdit) {
      updateSavingsGoal(goalToEdit.id, {
        title: title.trim(),
        targetAmount: target,
        currentAmount: initial,
        targetDate,
        category,
      });
    } else {
      addSavingsGoal({
        title: title.trim(),
        targetAmount: target,
        currentAmount: initial,
        targetDate,
        category,
        color: '#C7A476',
        icon: 'Target',
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? 'Adjust Savings Target' : 'Establish Savings Goal'}
      subtitle="Define milestones for emergency funds, acquisitions, or life experiences"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Goal Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Emergency Fund, Amalfi Coast Vacation, Down Payment"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-medium text-sm bg-white"
          />
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Target Amount ({settings.currency}) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 250000"
            value={targetAmount}
            onChange={e => {
              setTargetAmount(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-semibold text-base bg-white"
          />
        </div>

        {/* Current / Initial Amount */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            {goalToEdit ? 'Current Amount Saved' : 'Initial Seed Amount'} ({settings.currency})
          </label>
          <input
            type="number"
            step="any"
            placeholder="0"
            value={initialAmount}
            onChange={e => {
              setInitialAmount(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-semibold text-sm bg-white"
          />
        </div>

        {/* Target Date */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Target Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={e => {
              setTargetDate(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-medium text-sm bg-white"
          />
        </div>

        {/* Category Pill */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Category Pillar
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy text-espresso font-medium text-sm bg-white outline-none"
          >
            <option value="Emergency Reserve">Emergency Reserve</option>
            <option value="Travel & Leisure">Travel & Leisure</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Technology">Technology & Gadgets</option>
            <option value="Education">Education & Courses</option>
            <option value="Investments">Investments</option>
            <option value="General Savings">General Savings</option>
          </select>
        </div>

        {error && <p className="text-xs text-danger font-medium">{error}</p>}

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
            {goalToEdit ? 'Update Goal' : 'Save Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
