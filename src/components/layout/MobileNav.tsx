import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Target,
} from 'lucide-react';
import { PageId } from './Sidebar';

interface MobileNavProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activePage,
  setActivePage,
}) => {
  const items: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Ledger', icon: ArrowLeftRight },
    { id: 'budget', label: 'Budget', icon: PiggyBank },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'savings', label: 'Savings', icon: Target },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-beige-champagne/60 px-2 py-1.5 flex justify-around items-center shadow-lg">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-xs font-medium transition-colors ${
              isActive ? 'text-burgundy font-bold' : 'text-espresso-muted hover:text-burgundy'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-burgundy' : 'text-espresso-muted'}`} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
