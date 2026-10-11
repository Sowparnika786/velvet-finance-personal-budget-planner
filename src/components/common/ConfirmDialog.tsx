import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center py-2">
        <div className={`p-3 rounded-full mb-3 ${isDestructive ? 'bg-danger-light text-danger' : 'bg-warning-light text-warning'}`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-sm text-espresso-muted leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center space-x-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-luxury-sm border border-beige-champagne text-espresso font-medium text-sm hover:bg-beige-warm/30 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-luxury-sm text-white font-medium text-sm transition-colors shadow-sm ${
              isDestructive
                ? 'bg-danger hover:bg-danger/90'
                : 'bg-burgundy hover:bg-burgundy-hover'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
