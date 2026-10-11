import React, { useState } from 'react';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  PlusCircle,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { SavingsGoal } from '../types/finance';
import { formatCurrency } from '../utils/currency';
import { formatDisplayDate } from '../utils/dates';
import { SavingsGoalModal } from '../components/savings/SavingsGoalModal';
import { GoalContributionModal } from '../components/savings/GoalContributionModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const SavingsGoalsPage: React.FC = () => {
  const { savingsGoals, deleteSavingsGoal, settings } = useFinance();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);

  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [contributionGoal, setContributionGoal] = useState<SavingsGoal | null>(null);

  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);

  const totalTargeted = savingsGoals.reduce((sum: number, g: SavingsGoal) => sum + g.targetAmount, 0);
  const totalSaved = savingsGoals.reduce((sum: number, g: SavingsGoal) => sum + g.currentAmount, 0);
  const overallProgress = totalTargeted > 0 ? Math.round((totalSaved / totalTargeted) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Overview Banner */}
      <div className="luxury-card p-6 sm:p-8 bg-gradient-to-br from-white via-beige-ivory to-beige-warm/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-beige-champagne/60">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-luxury-sm bg-gold/20 text-gold-dark flex items-center justify-center flex-shrink-0 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-espresso-muted">
                Wealth Retention & Reserves
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-burgundy mt-0.5">
                Savings Goals
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              setGoalToEdit(null);
              setIsGoalModalOpen(true);
            }}
            className="flex items-center space-x-2 px-5 py-3 rounded-luxury-sm bg-burgundy hover:bg-burgundy-hover text-beige-champagne font-semibold text-xs tracking-wider transition-all shadow-md self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Goal</span>
          </button>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-luxury-sm bg-white border border-beige-champagne/60 shadow-sm">
            <span className="text-[11px] uppercase font-semibold text-espresso-muted">
              Total Target Capital
            </span>
            <p className="text-xl sm:text-2xl font-bold font-sans text-espresso mt-1">
              {formatCurrency(totalTargeted, settings.currency)}
            </p>
          </div>

          <div className="p-4 rounded-luxury-sm bg-white border border-beige-champagne/60 shadow-sm">
            <span className="text-[11px] uppercase font-semibold text-espresso-muted">
              Total Accumulated
            </span>
            <p className="text-xl sm:text-2xl font-bold font-sans text-burgundy mt-1">
              {formatCurrency(totalSaved, settings.currency)}
            </p>
          </div>

          <div className="p-4 rounded-luxury-sm bg-white border border-beige-champagne/60 shadow-sm">
            <span className="text-[11px] uppercase font-semibold text-espresso-muted">
              Aggregate Funding
            </span>
            <p className="text-xl sm:text-2xl font-bold font-sans text-gold-dark mt-1">
              {overallProgress}%
            </p>
          </div>
        </div>
      </div>

      {/* Isolation Notice Banner */}
      <div className="p-4 rounded-luxury-sm bg-gold/10 border border-gold/40 flex items-start space-x-3 text-xs text-espresso">
        <Sparkles className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold text-burgundy">Isolated Capital Preservation:</span> Savings goal contributions are tracked independently from monthly expense and income totals. This prevents double-counting and ensures your monthly cash flow reflects true spending.
        </p>
      </div>

      {/* Goals Grid */}
      {savingsGoals.length === 0 ? (
        <div className="luxury-card p-12 text-center text-espresso-muted">
          <Target className="w-12 h-12 text-beige-champagne mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-burgundy mb-1">
            No Savings Goals Initiated
          </h3>
          <p className="text-xs max-w-sm mx-auto mb-4">
            Create aspirational milestones such as an Emergency Reserve, Vacation, Laptop, or Home Down Payment.
          </p>
          <button
            onClick={() => {
              setGoalToEdit(null);
              setIsGoalModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-luxury-sm bg-burgundy text-beige-champagne text-xs font-semibold hover:bg-burgundy-hover transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savingsGoals.map((goal: SavingsGoal) => {
            const progress = goal.targetAmount > 0
              ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
              : 0;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <div
                key={goal.id}
                className="luxury-card p-6 flex flex-col justify-between relative group hover:border-gold/70 transition-all"
              >
                <div>
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      {goal.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-beige-warm/40 text-espresso-muted">
                          {goal.category}
                        </span>
                      )}
                      <h3 className="font-serif font-bold text-lg text-burgundy mt-1">
                        {goal.title}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setGoalToEdit(goal);
                          setIsGoalModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-espresso-muted hover:text-burgundy hover:bg-beige-warm/30 transition-colors"
                        title="Edit goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setGoalToDelete(goal)}
                        className="p-1.5 rounded-lg text-espresso-muted hover:text-danger hover:bg-danger-light transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="flex items-baseline justify-between mt-4 mb-2">
                    <div>
                      <span className="text-2xl font-bold font-sans text-espresso">
                        {formatCurrency(goal.currentAmount, settings.currency)}
                      </span>
                      <span className="text-xs text-espresso-muted ml-1.5">
                        of {formatCurrency(goal.targetAmount, settings.currency)}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-bold font-sans ${
                        isCompleted ? 'text-positive' : 'text-gold-dark'
                      }`}
                    >
                      {progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-beige-ivory rounded-full h-3 overflow-hidden border border-beige-champagne/40">
                    <div
                      className={`h-full transition-all duration-700 rounded-full ${
                        isCompleted
                          ? 'bg-positive'
                          : 'bg-gradient-to-r from-burgundy via-burgundy-secondary to-gold'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Deadline & Remaining */}
                  <div className="flex items-center justify-between text-xs text-espresso-muted mt-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-burgundy" />
                      <span>Target: {formatDisplayDate(goal.targetDate)}</span>
                    </div>
                    <span>
                      {isCompleted
                        ? 'Target Achieved'
                        : `${formatCurrency(remaining, settings.currency)} to go`}
                    </span>
                  </div>
                </div>

                {/* Bottom CTA to add contribution */}
                <div className="pt-5 mt-4 border-t border-beige-warm/40 flex items-center justify-between">
                  <span className="text-[11px] text-espresso-muted">
                    {goal.contributions?.length || 0} allocation{(goal.contributions?.length || 0) === 1 ? '' : 's'} recorded
                  </span>
                  <button
                    onClick={() => {
                      setContributionGoal(goal);
                      setIsContributionModalOpen(true);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-luxury-sm bg-beige-warm/40 hover:bg-beige-warm/70 text-burgundy text-xs font-semibold transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Contribute / Withdraw</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Creation/Edit Modal */}
      <SavingsGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setGoalToEdit(null);
        }}
        goalToEdit={goalToEdit}
      />

      {/* Contribution Record Modal */}
      <GoalContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => {
          setIsContributionModalOpen(false);
          setContributionGoal(null);
        }}
        goal={contributionGoal}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={() => {
          if (goalToDelete) {
            deleteSavingsGoal(goalToDelete.id);
            setGoalToDelete(null);
          }
        }}
        title="Delete Savings Goal"
        message={`Remove "${goalToDelete?.title}"? All contribution progress records for this goal will be cleared.`}
        confirmText="Delete Goal"
        isDestructive={true}
      />
    </div>
  );
};
