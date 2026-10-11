import { Category } from '../types/finance';

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#C58A3D' },
  { id: 'cat-shopping', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#701D32' },
  { id: 'cat-transport', name: 'Transportation', type: 'expense', icon: 'Car', color: '#806F6B' },
  { id: 'cat-rent', name: 'Rent & Housing', type: 'expense', icon: 'Home', color: '#4A0914' },
  { id: 'cat-utilities', name: 'Utilities', type: 'expense', icon: 'Zap', color: '#9F7E4F' },
  { id: 'cat-health', name: 'Healthcare', type: 'expense', icon: 'HeartPulse', color: '#B94A52' },
  { id: 'cat-education', name: 'Education', type: 'expense', icon: 'GraduationCap', color: '#4F6D7A' },
  { id: 'cat-entertainment', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#9B59B6' },
  { id: 'cat-travel', name: 'Travel', type: 'expense', icon: 'Plane', color: '#2E86AB' },
  { id: 'cat-groceries', name: 'Groceries', type: 'expense', icon: 'ShoppingCart', color: '#39755C' },
  { id: 'cat-insurance', name: 'Insurance', type: 'expense', icon: 'ShieldCheck', color: '#2C3E50' },
  { id: 'cat-other-exp', name: 'Other', type: 'expense', icon: 'MoreHorizontal', color: '#806F6B' },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'cat-salary', name: 'Salary', type: 'income', icon: 'Briefcase', color: '#39755C' },
  { id: 'cat-business', name: 'Business', type: 'income', icon: 'Building', color: '#2E86AB' },
  { id: 'cat-freelance', name: 'Freelancing', type: 'income', icon: 'Laptop', color: '#C7A476' },
  { id: 'cat-investments', name: 'Investments', type: 'income', icon: 'TrendingUp', color: '#27AE60' },
  { id: 'cat-gifts', name: 'Gifts', type: 'income', icon: 'Gift', color: '#E67E22' },
  { id: 'cat-other-inc', name: 'Other Income', type: 'income', icon: 'PlusCircle', color: '#701D32' },
];

export const INITIAL_CATEGORIES: Category[] = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];
