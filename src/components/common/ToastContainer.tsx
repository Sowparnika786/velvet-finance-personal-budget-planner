import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useFinance, ToastMessage } from '../../context/FinanceContext';

const getToastIcon = (type: ToastMessage['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-5 h-5 text-positive" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-danger" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-gold" />;
  }
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-beige-champagne/60 rounded-luxury-sm p-4 shadow-luxury flex items-start space-x-3 text-espresso"
          >
            <div className="flex-shrink-0 mt-0.5">{getToastIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-espresso font-sans leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-espresso-muted mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-espresso-muted hover:text-burgundy transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
