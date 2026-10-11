import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-luxury border border-dashed border-beige-champagne/70 bg-white/60">
      <div className="w-14 h-14 rounded-full bg-burgundy/5 border border-beige-champagne flex items-center justify-center text-burgundy mb-4 shadow-sm">
        <Icon className="w-6 h-6 text-burgundy" />
      </div>
      <h3 className="text-lg font-serif font-bold text-burgundy mb-1">
        {title}
      </h3>
      <p className="text-sm text-espresso-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-5 py-2.5 rounded-luxury-sm bg-burgundy text-beige-champagne hover:bg-burgundy-hover font-medium text-sm transition-all shadow-sm"
          >
            {actionText}
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="px-5 py-2.5 rounded-luxury-sm border border-beige-champagne text-burgundy hover:bg-beige-warm/30 font-medium text-sm transition-all"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};
