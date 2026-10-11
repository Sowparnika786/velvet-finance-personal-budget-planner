import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  FileCode,
  User,
  Sparkles,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CurrencyCode } from '../types/finance';
import { SUPPORTED_CURRENCIES } from '../utils/currency';
import {
  exportTransactionsToCSV,
  downloadFile,
  validateBackupData,
  BackupData,
} from '../utils/exportImport';
import { Modal } from '../components/common/Modal';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    transactions,
    budgets,
    categories,
    savingsGoals,
    importData,
    clearAllData,
    loadDemoData,
  } = useFinance();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Currency form state
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(settings.currency);
  const [defaultBudget, setDefaultBudget] = useState<string>(
    String(settings.defaultMonthlyBudget || 50000)
  );
  const [userName, setUserName] = useState<string>(settings.userName || 'Sowparnika P');

  // Clear data confirm modal
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearInput, setClearInput] = useState('');

  // Import preview modal state
  const [importPreview, setImportPreview] = useState<{
    data: BackupData;
    counts: { transactions: number; budgets: number; categories: number; savingsGoals: number };
  } | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      currency: selectedCurrency,
      defaultMonthlyBudget: parseFloat(defaultBudget) || 50000,
      userName: userName.trim() || 'Velvet User',
    });
  };

  const handleExportCSV = () => {
    const csv = exportTransactionsToCSV(transactions);
    downloadFile(csv, `velvet-finance-transactions-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const backup: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      source: 'Velvet Finance',
      transactions,
      budgets,
      categories,
      savingsGoals,
      settings,
    };
    const jsonStr = JSON.stringify(backup, null, 2);
    downloadFile(jsonStr, `velvet-finance-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const validated = validateBackupData(parsed);

        if (!validated.isValid || !validated.data) {
          alert(`Invalid backup format:\n${validated.errors.join('\n')}`);
          return;
        }

        setImportPreview({
          data: validated.data,
          counts: validated.counts,
        });
      } catch (err) {
        alert('Could not read the JSON file. Please ensure it is a valid Velvet Finance backup.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    if (importPreview) {
      importData(importPreview.data, importMode);
      setImportPreview(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl">
      {/* Privacy Notice Banner */}
      <div className="p-4 sm:p-5 rounded-luxury bg-white border border-beige-champagne/80 shadow-sm flex items-start space-x-3.5">
        <ShieldCheck className="w-6 h-6 text-burgundy flex-shrink-0 mt-0.5" />
        <div className="text-xs text-espresso leading-relaxed">
          <h4 className="font-bold text-burgundy text-sm mb-0.5">
            Local Browser Storage & Privacy Guarantee
          </h4>
          <p className="text-espresso-muted">
            Your financial records are stored locally in this browser. Clearing browser storage or changing devices may remove access to these records. Export backups regularly to ensure uninterrupted data retention.
          </p>
        </div>
      </div>

      {/* Profile & Currency Preferences Form */}
      <div className="luxury-card p-6 sm:p-8">
        <h3 className="font-serif font-bold text-lg text-burgundy mb-1">
          Preferences & Default Units
        </h3>
        <p className="text-xs text-espresso-muted mb-6">
          Personalize user display names, currency symbols, and default budgeting levels
        </p>

        <form onSubmit={handleSavePreferences} className="space-y-5">
          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1.5">
              Account Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-medium text-sm bg-white"
              />
            </div>
          </div>

          {/* Currency Preference */}
          <div>
            <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1.5">
              Display Currency Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map(code => {
                const cur = SUPPORTED_CURRENCIES[code];
                const isSelected = selectedCurrency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedCurrency(code)}
                    className={`p-3 rounded-luxury-sm border text-left transition-all ${
                      isSelected
                        ? 'border-burgundy bg-burgundy/5 ring-1 ring-burgundy shadow-sm'
                        : 'border-beige-champagne hover:bg-beige-warm/20 bg-white'
                    }`}
                  >
                    <span className="text-base font-bold font-sans text-burgundy block">
                      {cur.symbol} {cur.code}
                    </span>
                    <span className="text-[11px] text-espresso-muted block mt-0.5">
                      {cur.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-espresso-muted mt-2 italic">
              Note: Changing display currency updates symbols and number formatting ({selectedCurrency === 'INR' ? 'lakhs/crores formatting' : 'international grouping'}). Numerical balances are not converted.
            </p>
          </div>

          {/* Default Monthly Budget */}
          <div>
            <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1.5">
              Default Monthly Budget Target ({selectedCurrency})
            </label>
            <input
              type="number"
              step="any"
              value={defaultBudget}
              onChange={e => setDefaultBudget(e.target.value)}
              className="w-full max-w-xs px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-espresso font-semibold text-sm bg-white"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne font-semibold text-xs tracking-wider transition-all shadow-md active:scale-95"
          >
            Save Preferences
          </button>
        </form>
      </div>

      {/* Data Export & Backup Section */}
      <div className="luxury-card p-6 sm:p-8">
        <h3 className="font-serif font-bold text-lg text-burgundy mb-1">
          Backup & Data Portability
        </h3>
        <p className="text-xs text-espresso-muted mb-6">
          Export your complete financial records as structured JSON or spreadsheet CSV
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* JSON Full Backup */}
          <div className="p-4 rounded-luxury-sm border border-beige-champagne/70 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-burgundy mb-2">
                <FileCode className="w-5 h-5" />
                <h4 className="font-semibold text-sm">Full System Backup (JSON)</h4>
              </div>
              <p className="text-xs text-espresso-muted leading-relaxed">
                Includes all {transactions.length} transactions, monthly budgets, custom categories, and savings milestones.
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="mt-4 flex items-center justify-center space-x-1.5 px-4 py-2 rounded-luxury-sm bg-burgundy text-beige-champagne text-xs font-semibold hover:bg-burgundy-hover transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* CSV Transactions Export */}
          <div className="p-4 rounded-luxury-sm border border-beige-champagne/70 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-burgundy mb-2">
                <FileSpreadsheet className="w-5 h-5" />
                <h4 className="font-semibold text-sm">Transaction Ledger (CSV)</h4>
              </div>
              <p className="text-xs text-espresso-muted leading-relaxed">
                Export clean CSV tabular data ready for Microsoft Excel, Apple Numbers, or Google Sheets.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={transactions.length === 0}
              className="mt-4 flex items-center justify-center space-x-1.5 px-4 py-2 rounded-luxury-sm border border-beige-champagne hover:bg-beige-warm/30 text-xs font-semibold text-espresso transition-colors disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              <span>Download Transactions CSV</span>
            </button>
          </div>
        </div>

        {/* Restore Backup File Picker */}
        <div className="mt-6 pt-6 border-t border-beige-warm/40">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-sm text-espresso">
                Restore From Backup File
              </h4>
              <p className="text-xs text-espresso-muted">
                Import previously exported Velvet Finance JSON records safely.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-luxury-sm border border-burgundy text-burgundy hover:bg-burgundy/5 text-xs font-semibold transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Select Backup File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Demo Data & Clear Storage */}
      <div className="luxury-card p-6 sm:p-8 border-danger/30 bg-danger-light/20">
        <h3 className="font-serif font-bold text-lg text-danger mb-1 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>Data Maintenance & Reset</span>
        </h3>
        <p className="text-xs text-espresso-muted mb-6">
          Load demonstration records for sandbox evaluation or clear local cache
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Demo Data Button */}
          <button
            onClick={loadDemoData}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-luxury-sm bg-gold/20 text-gold-dark hover:bg-gold/30 border border-gold/40 text-xs font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Demo Data</span>
          </button>

          {/* Clear Storage */}
          <button
            onClick={() => {
              setClearInput('');
              setIsClearModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-luxury-sm bg-danger text-white hover:bg-danger/90 text-xs font-semibold transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Local Data</span>
          </button>
        </div>
      </div>

      {/* Import Confirmation & Preview Modal */}
      <Modal
        isOpen={Boolean(importPreview)}
        onClose={() => setImportPreview(null)}
        title="Confirm Backup Restoration"
        subtitle="Review records discovered in the backup archive"
        maxWidth="md"
      >
        {importPreview && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-luxury-sm bg-beige-ivory border border-beige-champagne/60 space-y-1.5 text-xs">
              <p className="flex justify-between">
                <span className="text-espresso-muted">Transactions:</span>
                <span className="font-bold text-espresso">{importPreview.counts.transactions} records</span>
              </p>
              <p className="flex justify-between">
                <span className="text-espresso-muted">Budgets:</span>
                <span className="font-bold text-espresso">{importPreview.counts.budgets} records</span>
              </p>
              <p className="flex justify-between">
                <span className="text-espresso-muted">Categories:</span>
                <span className="font-bold text-espresso">{importPreview.counts.categories} categories</span>
              </p>
              <p className="flex justify-between">
                <span className="text-espresso-muted">Savings Goals:</span>
                <span className="font-bold text-espresso">{importPreview.counts.savingsGoals} targets</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1.5">
                Restoration Strategy
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setImportMode('merge')}
                  className={`p-3 rounded-luxury-sm border text-left transition-all ${
                    importMode === 'merge'
                      ? 'border-burgundy bg-burgundy/5 ring-1 ring-burgundy'
                      : 'border-beige-champagne bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-burgundy">Merge</p>
                  <p className="text-[11px] text-espresso-muted mt-0.5">Keep existing & append new records</p>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`p-3 rounded-luxury-sm border text-left transition-all ${
                    importMode === 'replace'
                      ? 'border-danger bg-danger-light ring-1 ring-danger'
                      : 'border-beige-champagne bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-danger">Replace</p>
                  <p className="text-[11px] text-espresso-muted mt-0.5">Overwrite all current data</p>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setImportPreview(null)}
                className="flex-1 py-2.5 px-4 rounded-luxury-sm border border-beige-champagne text-espresso font-medium text-sm hover:bg-beige-warm/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="flex-1 py-2.5 px-4 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne font-semibold text-sm transition-all shadow-md"
              >
                Restore Records
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Wipe All Local Financial Records"
        subtitle="This action is irreversible"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-luxury-sm bg-danger-light border border-danger/40 text-danger text-xs leading-relaxed">
            All stored transactions, budgets, custom categories, and savings goals will be permanently deleted from this browser.
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso-muted uppercase tracking-wider mb-1">
              Type <span className="font-bold text-danger">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              placeholder="DELETE"
              value={clearInput}
              onChange={e => setClearInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-luxury-sm border border-beige-champagne focus:border-danger outline-none text-espresso font-semibold text-sm bg-white"
            />
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setIsClearModalOpen(false)}
              className="flex-1 py-2.5 px-4 rounded-luxury-sm border border-beige-champagne text-espresso font-medium text-sm hover:bg-beige-warm/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={clearInput !== 'DELETE'}
              onClick={() => {
                clearAllData();
                setIsClearModalOpen(false);
              }}
              className="flex-1 py-2.5 px-4 rounded-luxury-sm bg-danger text-white hover:bg-danger/90 font-semibold text-sm transition-all disabled:opacity-40"
            >
              Permanently Clear
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
