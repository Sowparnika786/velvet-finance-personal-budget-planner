import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Tags,
  BarChart3,
  Target,
  Settings,
  Sparkles,
  Quote,
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'transactions'
  | 'budget'
  | 'categories'
  | 'analytics'
  | 'savings'
  | 'settings';

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'budget', label: 'Monthly Budget', icon: PiggyBank },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'savings', label: 'Savings Goals', icon: Target },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-espresso/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-burgundy text-beige-champagne flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-burgundy-secondary shadow-2xl lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Monogram & Name */}
        <div>
          <div className="p-6 border-b border-burgundy-secondary/60 flex items-center space-x-3.5">
            {/* Monogram Crest */}
            <div className="w-11 h-11 rounded-luxury-sm bg-gradient-to-br from-burgundy-secondary to-burgundy-dark border border-gold/40 flex items-center justify-center shadow-lg relative overflow-hidden group">
              <span className="font-serif font-bold text-lg text-gold tracking-widest">
                VF
              </span>
              <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <div>
              <h1 className="font-serif font-bold text-lg tracking-wide text-white leading-tight">
                VELVET FINANCE
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-gold font-medium">
                Personal Budget Planner
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-luxury-sm text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-burgundy-secondary to-burgundy text-white shadow-md border-l-4 border-gold'
                      : 'text-beige-champagne/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-gold' : 'text-beige-champagne/70'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Financial Wellness Quote */}
        <div className="p-4 m-4 rounded-luxury-sm bg-burgundy-dark/70 border border-burgundy-secondary/50 text-beige-champagne/90">
          <div className="flex items-center space-x-1.5 text-gold text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FINANCIAL WELLNESS</span>
          </div>
          <div className="flex items-start space-x-2 mt-2">
            <Quote className="w-3.5 h-3.5 text-gold/60 flex-shrink-0 mt-0.5" />
            <p className="text-xs italic font-serif leading-relaxed text-beige-champagne">
              "Plan Beautifully. Spend Wisely. Save Confidently."
            </p>
          </div>
          <p className="text-[10px] text-right text-beige-champagne/60 mt-1">
            — Velvet Wisdom
          </p>
        </div>
      </aside>
    </>
  );
};
