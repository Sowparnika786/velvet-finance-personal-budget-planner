import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { TransactionModal } from './components/transactions/TransactionModal';
import { Transaction } from './types/finance';

import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetPage } from './pages/BudgetPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SavingsGoalsPage } from './pages/SavingsGoalsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Global transaction modal state
  const [isTxModalOpen, setIsTxModalOpen] = useState<boolean>(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);

  const handleOpenAdd = () => {
    setTxToEdit(null);
    setIsTxModalOpen(true);
  };

  const handleEdit = (tx: Transaction) => {
    setTxToEdit(tx);
    setIsTxModalOpen(true);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            setActivePage={setActivePage}
            onOpenAddTransaction={handleOpenAdd}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage
            onOpenAddTransaction={handleOpenAdd}
            onEditTransaction={handleEdit}
          />
        );
      case 'budget':
        return <BudgetPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'savings':
        return <SavingsGoalsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            setActivePage={setActivePage}
            onOpenAddTransaction={handleOpenAdd}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-beige-ivory satin-accent-subtle flex text-espresso font-sans antialiased selection:bg-burgundy selection:text-beige-champagne">
      {/* Desktop Fixed Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pb-20 lg:pb-8">
        {/* Top Header */}
        <Header
          activePage={activePage}
          onOpenMobileMenu={() => setIsOpenMobile(true)}
          onOpenAddTransaction={handleOpenAdd}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} />

      {/* Global Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setTxToEdit(null);
        }}
        transactionToEdit={txToEdit}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
};

export default App;
