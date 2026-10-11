import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  amount: string;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  trendText?: string;
  trendType?: 'positive' | 'warning' | 'danger' | 'neutral';
  progress?: number; // 0 to 100
  progressColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-beige-warm/40',
  iconColor = 'text-burgundy',
  trendText,
  trendType = 'neutral',
  progress,
  progressColor = 'bg-burgundy',
}) => {
  const getBadgeStyle = () => {
    switch (trendType) {
      case 'positive':
        return 'bg-positive-light text-positive border-positive/30';
      case 'warning':
        return 'bg-warning-light text-warning border-warning/30';
      case 'danger':
        return 'bg-danger-light text-danger border-danger/30';
      default:
        return 'bg-beige-warm/30 text-espresso-muted border-beige-champagne/40';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="luxury-card p-6 flex flex-col justify-between relative overflow-hidden group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-espresso-muted">
            {title}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-sans text-espresso mt-1 tracking-tight">
            {amount}
          </h3>
        </div>
        <div
          className={`w-12 h-12 rounded-luxury-sm ${iconBgColor} ${iconColor} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-sm`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div>
        {progress !== undefined && (
          <div className="w-full bg-beige-ivory rounded-full h-2 mb-2 overflow-hidden border border-beige-champagne/30">
            <div
              className={`h-full ${progressColor} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}

        <div className="flex items-center justify-between text-xs mt-1">
          {subtitle && (
            <span className="text-espresso-muted truncate mr-2">
              {subtitle}
            </span>
          )}
          {trendText && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium border flex-shrink-0 ${getBadgeStyle()}`}
            >
              {trendText}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
