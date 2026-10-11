# VELVET FINANCE — Personal Budget Planner

> *"Plan Beautifully. Spend Wisely. Save Confidently."*

![Velvet Finance](https://img.shields.io/badge/Velvet_Finance-Luxury_Fintech-4A0914?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-Passing-39755C?style=for-the-badge)

**VELVET FINANCE** is a luxury personal finance and budget planner web application crafted with an haute-couture **Beige + Burgundy** aesthetic. Designed as a high-net-worth wealth management dashboard, it allows users to establish monthly budgets, log granular cash flow, monitor real-time pacing alerts, visualize six-month trends, track dedicated savings milestones, and persist records locally with zero external server dependencies.

---

## 💎 Design System & Palette

Crafted to evoke the feel of private wealth advisory suites with soft satin-inspired gradients and warm luxury tones:

| Token | Hex | Role | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Burgundy** | `#4A0914` | Primary Accent | Sidebar backdrop, primary action buttons, expense charts |
| **Secondary Burgundy**| `#701D32` | Secondary Accent| Gradients, hover states, secondary pill borders |
| **Soft Ivory** | `#F8F3EC` | Canvas Background| Main page backdrop with subtle satin radial glow |
| **Warm Beige / White**| `#FFFFFF` / `#E8D8C3` | Card Surface | Elevated card surfaces, metric containers |
| **Champagne Beige** | `#D8C3A5` | Neutral Borders | Card outlines, dividers, subtle inputs |
| **Muted Gold** | `#C7A476` | Highlight / Luxe | Savings goals, trophies, monograms, progress accents |
| **Dark Espresso** | `#281B1B` | Typography Base | High-contrast headings and primary labels |
| **Muted Text** | `#806F6B` | Secondary Text | Subtitles, timestamps, auxiliary metrics |
| **Positive Green** | `#39755C` | Inflow Surplus | Income indicators, positive balance, surplus |
| **Warning Amber** | `#C58A3D` | Caution Pacing | 70%–89% budget threshold alerts |
| **Danger Red** | `#B94A52` | Critical Breaches | Overspending alerts (≥90%), monthly cashflow deficits |

### Typography
- **Headings**: *Playfair Display* (Editorial luxury serif)
- **Body & Numerals**: *Inter* (Crisp tabular fintech numerals)

---

## 🚀 Key Features

### 1. Executive Dashboard
- **4 Real-Time Summary Cards**:
  - **Total Income**: Inflows for the selected month with savings percentage.
  - **Total Expenses**: Outflows with budget utilization pacing.
  - **Remaining Balance**: Real-time surplus or deficit indication.
  - **Remaining Budget**: Pacing buffer with overspending warnings.
- **Dynamic Budget Gauge**: Multi-tier visual progress bar with automated color zones:
  - 🟢 **Safe Zone**: Below 70%
  - 🟡 **Caution Zone**: 70% to 89%
  - 🔴 **Alert Zone**: 90% and above / Over budget
- **Monthly Income vs Expenses Bar Chart**: Historical 6-month comparison powered by Recharts.
- **Expense Distribution Donut Chart**: Category-by-category breakdown with percentages.
- **Recent Transactions Ledger**: Quick view of latest 5 items with instant category iconography.
- **Financial Intelligence Insights**: Rule-based automated observations (budget pacing, top expense category, savings rate benchmark).

### 2. Income & Expense Ledger (Transactions)
- Full CRUD management (Add, Edit, Delete with confirmation).
- Form validation powered by **React Hook Form + Zod**.
- Real-time search across descriptions and memos.
- Multi-dimensional filters: Type (All/Income/Expense), Category, and Month Scope.
- Sorting: Date newest/oldest, Amount ascending/descending.
- CSV export for spreadsheets.

### 3. Monthly Budgeting System
- Month-by-month independent budget targets.
- Overspending alert banners when outflows breach limits.
- Historical budget performance ledger with variance and utilization metrics.
- Seamless month-picker navigation with immediate recalculation.

### 4. Custom Category Classification
- 12 Predefined expense categories & 6 Predefined income categories.
- Create custom categories with custom icons and tailored luxury color swatches.
- **Safe Reassignment Workflow**: When deleting a category linked to existing transactions, Velvet Finance prompts for reassignment before removal to avoid orphaned records.

### 5. Advanced Financial Analytics
- Continuous spending and savings flow trend curves (3, 6, 12-month scopes).
- Monthly net savings volume and coverage ratio.
- **Savings Rate Formula**: `((Income - Expenses) / Income) * 100` (safe handling of zero/negative income).
- Top spending categories and historical average monthly outflows.

### 6. Savings Goals & Capital Retention
- Dedicated goals tracker (Emergency Fund, Vacation, Gadgets, Down Payment).
- Track target amount, deadline dates, and percentage completion.
- **Double-Counting Prevention**: Goal contributions are tracked in isolated capital reserve accounts, never polluting monthly operating cashflow.

### 7. Currency & Internationalization
- **Default Currency**: Indian Rupee (`INR` - `₹`) with `en-IN` numbering (lakhs & crores grouping).
- Display currency switcher for `USD` (`$`), `EUR` (`€`), and `GBP` (`£`).
- Non-destructive display conversion that respects stored numerical precision.

### 8. Browser Data Persistence & Portability
- 100% Client-side local storage persistence with typed storage adapters.
- **Full JSON Backup & Restore**: Export full database state and restore via Merge or Replace modes.
- **Single-Click Demo Dataset**: Populate rich multi-month Indian financial scenarios on demand.
- Secure data wipe requiring explicit typed `DELETE` confirmation.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite 5 + TypeScript 5
- **Styling**: Tailwind CSS 3 with custom design tokens
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Validation**: React Hook Form + Zod
- **Dates**: `date-fns`
- **Testing**: Vitest

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
git clone https://github.com/Sowparnika786/velvet-finance-personal-budget-planner.git
cd velvet-finance-personal-budget-planner
npm install
```

### Development Server
Run the local dev server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Automated Testing
Execute the unit test suite:
```bash
npm run test
```

### Production Build
Create an optimized production bundle:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── common/           # Modal, ConfirmDialog, StatCard, ToastContainer, EmptyState
│   ├── layout/           # Sidebar, Header, MobileNav
│   ├── dashboard/        # SummaryCards, SpendingChart, ExpenseDonutChart, BudgetProgressBar, RecentTransactions, InsightsCard
│   ├── transactions/     # TransactionModal
│   ├── budget/           # SetBudgetModal
│   ├── categories/       # CategoryModal, ReassignModal
│   ├── savings/          # SavingsGoalModal, GoalContributionModal
│   └── settings/         # Backup & preferences components
├── pages/
│   ├── DashboardPage.tsx
│   ├── TransactionsPage.tsx
│   ├── BudgetPage.tsx
│   ├── CategoriesPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── SavingsGoalsPage.tsx
│   └── SettingsPage.tsx
├── context/
│   └── FinanceContext.tsx# Reactive financial state, persistence & dispatchers
├── utils/
│   ├── calculations.ts   # Pure mathematical functions (sums, balance, savings rate)
│   ├── currency.ts       # Indian Rupee Intl.NumberFormat (en-IN) & multi-currency
│   ├── dates.ts          # Zero-timezone-shift date formatters and month navigators
│   ├── storage.ts        # Typed localStorage engine with versioning & error safety
│   ├── exportImport.ts   # CSV & JSON export/import parsers with schema validation
│   └── categoryIcons.tsx # Dynamic Lucide icon registry
├── data/
│   ├── defaultCategories.ts # Standard expense and income taxonomy
│   └── demoData.ts       # Curated Indian wealth scenarios spanning months
├── types/
│   └── finance.ts        # TypeScript domain models
├── App.tsx
├── main.tsx
└── index.css
```

---

## ⚠️ Known Limitations & Notes
- **Local Browser Persistence**: All financial records reside strictly within your current browser's `localStorage`. Clearing browser cookies/cache or opening in an incognito session will start with fresh storage. Regularly download a JSON backup from the Settings tab.
- **Display Currencies**: Changing the active currency alters symbol and formatting representation only. Historical values are preserved as entered without automated foreign exchange conversion.

---

## 📜 License
MIT License. Built with elegance and precision.
