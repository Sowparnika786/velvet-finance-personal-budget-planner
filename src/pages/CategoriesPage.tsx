import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tags, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Category, Transaction } from '../types/finance';
import { getCategoryIcon } from '../utils/categoryIcons';
import { CategoryModal } from '../components/categories/CategoryModal';
import { ReassignModal } from '../components/categories/ReassignModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatCurrency } from '../utils/currency';

export const CategoriesPage: React.FC = () => {
  const { categories, transactions, deleteCategory, settings } = useFinance();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // Deletion workflows
  const [simpleCategoryToDelete, setSimpleCategoryToDelete] = useState<Category | null>(null);
  const [reassignCategoryToDelete, setReassignCategoryToDelete] = useState<Category | null>(null);
  const [dependentCount, setDependentCount] = useState<number>(0);

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  const handleDeleteRequest = (cat: Category) => {
    const matchingTxCount = transactions.filter((t: Transaction) => t.category === cat.name).length;
    if (matchingTxCount > 0) {
      setDependentCount(matchingTxCount);
      setReassignCategoryToDelete(cat);
    } else {
      setSimpleCategoryToDelete(cat);
    }
  };

  const renderCategoryCard = (cat: Category) => {
    const txCount = transactions.filter((t: Transaction) => t.category === cat.name).length;
    const totalAmount = transactions
      .filter((t: Transaction) => t.category === cat.name)
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    return (
      <div
        key={cat.id}
        className="luxury-card p-4 flex items-center justify-between hover:border-gold/60 transition-all group"
      >
        <div className="flex items-center space-x-3.5 min-w-0">
          <div
            className="w-10 h-10 rounded-luxury-sm flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
          >
            {getCategoryIcon(cat.icon, { className: 'w-5 h-5' })}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-sm text-espresso truncate">
                {cat.name}
              </h4>
              {cat.isCustom && (
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-gold/15 text-gold-dark rounded">
                  Custom
                </span>
              )}
            </div>
            <p className="text-[11px] text-espresso-muted">
              {txCount} transaction{txCount === 1 ? '' : 's'} •{' '}
              <span className="font-semibold text-espresso">
                {formatCurrency(totalAmount, settings.currency)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              setCategoryToEdit(cat);
              setIsCategoryModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-espresso-muted hover:text-burgundy hover:bg-beige-warm/30 transition-colors"
            title="Edit category"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteRequest(cat)}
            className="p-1.5 rounded-lg text-espresso-muted hover:text-danger hover:bg-danger-light transition-colors"
            title="Delete category"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="luxury-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-luxury-sm bg-burgundy/10 text-burgundy flex items-center justify-center flex-shrink-0">
            <Tags className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-burgundy">
              Financial Classification Tags
            </h2>
            <p className="text-xs text-espresso-muted">
              Tailor expense and income categories to reflect your personal spending profile
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCategoryToEdit(null);
            setIsCategoryModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne text-xs font-semibold tracking-wider transition-all shadow-md self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Expense Categories */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <ArrowDownLeft className="w-4 h-4 text-burgundy" />
          <h3 className="font-serif font-bold text-lg text-burgundy">
            Expense Categories ({expenseCategories.length})
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenseCategories.map(renderCategoryCard)}
        </div>
      </div>

      {/* Income Categories */}
      <div className="space-y-4 pt-4 border-t border-beige-warm/60">
        <div className="flex items-center space-x-2">
          <ArrowUpRight className="w-4 h-4 text-positive" />
          <h3 className="font-serif font-bold text-lg text-positive">
            Income Categories ({incomeCategories.length})
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeCategories.map(renderCategoryCard)}
        </div>
      </div>

      {/* Category Editor Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setCategoryToEdit(null);
        }}
        categoryToEdit={categoryToEdit}
      />

      {/* Simple Deletion Dialog (no dependent transactions) */}
      <ConfirmDialog
        isOpen={Boolean(simpleCategoryToDelete)}
        onClose={() => setSimpleCategoryToDelete(null)}
        onConfirm={() => {
          if (simpleCategoryToDelete) {
            deleteCategory(simpleCategoryToDelete.id);
            setSimpleCategoryToDelete(null);
          }
        }}
        title="Delete Category"
        message={`Remove category "${simpleCategoryToDelete?.name}"? No transactions are currently using this tag.`}
        confirmText="Remove Category"
        isDestructive={true}
      />

      {/* Reassignment Workflow Dialog (dependent transactions exist) */}
      <ReassignModal
        isOpen={Boolean(reassignCategoryToDelete)}
        onClose={() => setReassignCategoryToDelete(null)}
        categoryToDelete={reassignCategoryToDelete}
        dependentCount={dependentCount}
      />
    </div>
  );
};
