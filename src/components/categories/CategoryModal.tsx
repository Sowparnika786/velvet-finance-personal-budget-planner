import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { Category, TransactionType } from '../../types/finance';
import { AVAILABLE_ICON_NAMES, getCategoryIcon } from '../../utils/categoryIcons';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
}

const PRESET_COLORS = [
  '#4A0914', // Primary burgundy
  '#701D32', // Secondary burgundy
  '#C7A476', // Muted gold
  '#C58A3D', // Amber
  '#39755C', // Positive green
  '#B94A52', // Danger red
  '#4F6D7A', // Slate blue
  '#2E86AB', // Ocean blue
  '#9B59B6', // Amethyst purple
  '#E67E22', // Tangerine
  '#2C3E50', // Midnight
  '#806F6B', // Espresso muted
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
}) => {
  const { addCategory, updateCategory } = useFinance();

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [icon, setIcon] = useState('Tag');
  const [color, setColor] = useState('#4A0914');
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setType(categoryToEdit.type);
      setIcon(categoryToEdit.icon);
      setColor(categoryToEdit.color);
    } else {
      setName('');
      setType('expense');
      setIcon('Tag');
      setColor('#4A0914');
    }
    setError('');
  }, [categoryToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category title is required.');
      return;
    }

    if (categoryToEdit) {
      updateCategory(categoryToEdit.id, {
        name: name.trim(),
        type,
        icon,
        color,
      });
    } else {
      addCategory({
        name: name.trim(),
        type,
        icon,
        color,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categoryToEdit ? 'Modify Category' : 'Create Custom Category'}
      subtitle="Define category characteristics, icon, and luxury color tag"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Category Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Subscriptions, Consulting, Wine Cellar"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-medium text-sm transition-colors bg-white"
          />
          {error && <p className="text-xs text-danger mt-1 font-medium">{error}</p>}
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
            Category Classification
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 px-3 rounded-luxury-sm text-xs font-semibold border transition-all ${
                type === 'expense'
                  ? 'bg-burgundy text-white border-burgundy'
                  : 'bg-white text-espresso-muted border-beige-champagne'
              }`}
            >
              Expense Category
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 px-3 rounded-luxury-sm text-xs font-semibold border transition-all ${
                type === 'income'
                  ? 'bg-positive text-white border-positive'
                  : 'bg-white text-espresso-muted border-beige-champagne'
              }`}
            >
              Income Category
            </button>
          </div>
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1.5">
            Select Icon
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-36 overflow-y-auto p-2 border border-beige-champagne/60 rounded-luxury-sm bg-beige-ivory/30">
            {AVAILABLE_ICON_NAMES.map(iconName => (
              <button
                key={iconName}
                type="button"
                onClick={() => setIcon(iconName)}
                className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                  icon === iconName
                    ? 'bg-burgundy text-gold ring-2 ring-gold/60 scale-105'
                    : 'text-espresso-muted hover:text-burgundy hover:bg-white'
                }`}
                title={iconName}
              >
                {getCategoryIcon(iconName, { className: 'w-4 h-4' })}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1.5">
            Color Accent
          </label>
          <div className="flex flex-wrap gap-2.5">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-offset-2 ring-burgundy' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
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
            {categoryToEdit ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
