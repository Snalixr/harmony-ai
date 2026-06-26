import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function BreathingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;

    let timeout: NodeJS.Timeout;

    const cycle = () => {
      setPhase('inhale');
      timeout = setTimeout(() => {
        setPhase('hold');
        timeout = setTimeout(() => {
          setPhase('exhale');
          timeout = setTimeout(() => {
            setPhase('hold2');
            timeout = setTimeout(cycle, 1500);
          }, 6000);
        }, 3000);
      }, 4000);
    };

    cycle();

    return () => clearTimeout(timeout);
  }, [isOpen]);

  // ESC key to close
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

  const phaseInstructions = {
    inhale: t.breatheIn,
    hold: t.hold,
    exhale: t.breatheOut,
    hold2: t.hold
  };

  const scale = phase === 'inhale' || phase === 'hold' ? 1.5 : 1;
  const opacity = phase === 'inhale' || phase === 'hold' ? 0.8 : 0.4;
  const duration = phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 0.5;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 90%, transparent)' }}
          role="dialog"
          aria-modal="true"
          aria-label={t.breatheMethod}
        >
          <div className="absolute top-6 right-6">
            <button onClick={onClose} className="p-3 rounded-full shadow-sm transition-colors" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }} aria-label="Close">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-12 md:space-y-16 mt-8 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-serif text-center max-w-md px-4" style={{ color: 'var(--color-primary)' }}>
              {t.groundYourself}
            </h2>

            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div
                animate={{ scale, opacity }}
                transition={{ duration, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full mix-blend-multiply filter blur-xl"
                style={{ backgroundColor: 'var(--color-text-muted)' }}
              />
              <motion.div
                animate={{ scale }}
                transition={{ duration, ease: "easeInOut" }}
                className="absolute w-40 h-40 rounded-full shadow-lg"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              />
              <div className="z-10 text-xl font-medium tracking-widest uppercase" style={{ color: 'var(--color-primary)' }}>
                {phaseInstructions[phase]}
              </div>
            </div>

            <p className="text-sm tracking-[0.2em] uppercase" style={{ color: 'var(--color-text-muted)' }}>{t.breatheMethod}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
