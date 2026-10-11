import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Zap,
  HeartPulse,
  GraduationCap,
  Film,
  Plane,
  ShoppingCart,
  ShieldCheck,
  MoreHorizontal,
  Briefcase,
  Building,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle,
  Tag,
  DollarSign,
  Coffee,
  LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Zap,
  HeartPulse,
  GraduationCap,
  Film,
  Plane,
  ShoppingCart,
  ShieldCheck,
  MoreHorizontal,
  Briefcase,
  Building,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle,
  Tag,
  DollarSign,
  Coffee,
};

export const getCategoryIcon = (iconName: string = '', props?: LucideProps): React.ReactElement => {
  const IconComponent = ICON_MAP[iconName] || Tag;
  return <IconComponent {...props} />;
};

export const AVAILABLE_ICON_NAMES = Object.keys(ICON_MAP);
