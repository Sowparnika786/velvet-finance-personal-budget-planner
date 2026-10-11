import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType } from '../../types/finance';
import { getTodayDateString } from '../../utils/dates';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce
    .number({ invalid_type_error: 'Please enter a valid numeric amount' })
    .positive('Amount must be greater than zero'),
  category: z.string().min(1, 'Please select a category'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionToEdit,
}) => {
  const { categories, addTransaction, updateTransaction, settings } = useFinance();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: undefined,
      category: '',
      date: getTodayDateString(),
      description: '',
    },
  });

  const selectedType = watch('type');

  // Filter categories matching current transaction type
  const availableCategories = categories.filter(c => c.type === selectedType);

  useEffect(() => {
    if (transactionToEdit) {
      reset({
        type: transactionToEdit.type,
        amount: transactionToEdit.amount,
        category: transactionToEdit.category,
        date: transactionToEdit.date,
        description: transactionToEdit.description,
      });
    } else {
      reset({
        type: 'expense',
        amount: undefined,
        category: availableCategories[0]?.name || '',
        date: getTodayDateString(),
        description: '',
      });
    }
  }, [transactionToEdit, isOpen, reset]);

  // When type changes, ensure valid category is selected
  const handleTypeChange = (newType: TransactionType) => {
    setValue('type', newType);
    const matching = categories.filter(c => c.type === newType);
    if (matching.length > 0) {
      setValue('category', matching[0].name);
    } else {
      setValue('category', '');
    }
  };

  const onSubmit = (data: TransactionFormData) => {
    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, {
        type: data.type,
        amount: Number(data.amount),
        category: data.category,
        date: data.date,
        description: data.description || '',
      });
    } else {
      addTransaction({
        type: data.type,
        amount: Number(data.amount),
        category: data.category,
        date: data.date,
        description: data.description || '',
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? 'Edit Transaction' : 'Record Transaction'}
      subtitle="Enter details to update your personal financial ledger"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type Toggle: Income vs Expense */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1.5">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-luxury-sm font-semibold text-sm border transition-all ${
                selectedType === 'expense'
                  ? 'bg-burgundy text-white border-burgundy shadow-sm'
                  : 'bg-white text-espresso-muted border-beige-champagne hover:bg-beige-warm/30'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Expense</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-luxury-sm font-semibold text-sm border transition-all ${
                selectedType === 'income'
                  ? 'bg-positive text-white border-positive shadow-sm'
                  : 'bg-white text-espresso-muted border-beige-champagne hover:bg-beige-warm/30'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Income</span>
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Amount ({settings.currency}) <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="any"
              placeholder="0.00"
              {...register('amount')}
              className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-semibold font-sans text-base transition-colors bg-white"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-danger mt-1 font-medium">
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Category <span className="text-danger">*</span>
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-medium text-sm transition-colors bg-white"
          >
            <option value="">Select a category</option>
            {availableCategories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-danger mt-1 font-medium">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            {...register('date')}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-medium text-sm transition-colors bg-white"
          />
          {errors.date && (
            <p className="text-xs text-danger mt-1 font-medium">
              {errors.date.message}
            </p>
          )}
        </div>

        {/* Description (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Description / Memo (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Dinner with clients, Freelance invoice #104"
            {...register('description')}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-medium text-sm transition-colors bg-white"
          />
        </div>

        {/* Submit and Cancel Buttons */}
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
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne font-semibold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {transactionToEdit ? 'Save Changes' : 'Record Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
