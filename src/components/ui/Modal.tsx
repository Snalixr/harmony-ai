import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  title?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-lg',
  title,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#2d2d2a]/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`
              relative z-10
              bg-[var(--color-surface)]
              ${maxWidth} w-full
              max-h-[90dvh]
              flex flex-col
              rounded-[var(--radius-xl)]
              overflow-hidden
              shadow-[var(--shadow-elevated)]
            `}
          >
            {/* Header with title + close */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                <h2 className="text-lg font-serif font-medium" style={{ color: 'var(--color-primary)' }}>
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-alt)] transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
