import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { Category } from '../../types/finance';
import { AlertTriangle } from 'lucide-react';

interface ReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToDelete: Category | null;
  dependentCount: number;
}

export const ReassignModal: React.FC<ReassignModalProps> = ({
  isOpen,
  onClose,
  categoryToDelete,
  dependentCount,
}) => {
  const { categories, deleteCategory } = useFinance();

  const alternativeCategories = categories.filter(
    c => c.id !== categoryToDelete?.id && c.type === categoryToDelete?.type
  );

  const [reassignTo, setReassignTo] = useState<string>(
    alternativeCategories[0]?.name || ''
  );

  const handleConfirm = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id, reassignTo);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reassign Dependent Transactions"
      subtitle="Ensure no financial records are orphaned"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-3.5 rounded-luxury-sm bg-warning-light border border-warning/40 flex items-start space-x-3 text-warning">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-warning" />
          <p className="text-xs text-espresso leading-relaxed">
            The category <span className="font-bold text-burgundy">"{categoryToDelete?.name}"</span> is currently assigned to{' '}
            <span className="font-bold text-espresso">{dependentCount} transaction(s)</span>.
            Please reassign them to an alternative {categoryToDelete?.type} category below to safely continue.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1.5">
            Reassign To Category
          </label>
          <select
            value={reassignTo}
            onChange={e => setReassignTo(e.target.value)}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne text-espresso font-medium text-sm bg-white outline-none focus:border-burgundy"
          >
            {alternativeCategories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
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
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            Reassign & Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};
