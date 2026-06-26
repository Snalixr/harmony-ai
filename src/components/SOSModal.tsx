import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Phone, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SOSModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
          style={{ backgroundColor: 'color-mix(in srgb, #2d2d2a 80%, transparent)' }}
          role="dialog"
          aria-modal="true"
          aria-label={t.notAlone}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="max-w-lg w-full max-h-[90dvh] flex flex-col overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            <div className="p-6 flex items-center justify-between shrink-0" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 fill-white text-white" />
                <h2 className="text-xl font-serif font-medium">{t.notAlone}</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 overflow-y-auto no-scrollbar">
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-primary)' }}>
                {t.sosDesc}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-[var(--radius-lg)]" style={{ backgroundColor: 'var(--color-surface-alt)', border: '1px solid var(--color-border)' }}>
                  <div className="p-3 rounded-full shadow-sm" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }}>
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{t.call988}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t.lifeline}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-[var(--radius-lg)]" style={{ backgroundColor: 'var(--color-surface-alt)', border: '1px solid var(--color-border)' }}>
                  <div className="p-3 rounded-full shadow-sm" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }}>
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{t.findHelpline}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t.intlHelpline}</p>
                    <a href="https://findahelpline.com/" target="_blank" rel="noreferrer" className="text-sm font-medium underline mt-2 inline-block" style={{ color: 'var(--color-primary)' }}>{t.visitHelpline}</a>
                  </div>
                </div>
              </div>

              <button onClick={onClose} className="w-full py-3 font-medium rounded-[var(--radius-md)] transition-colors mt-6" style={{ backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-primary)' }}>
                {t.returnChat}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
