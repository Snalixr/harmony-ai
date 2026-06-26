import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, MailOpen, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function CopingCardsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [cards, setCards] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { language, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(`harmony_coping_cards_${language}`);
      if (saved) {
        setCards(JSON.parse(saved));
      } else {
        const defaultCards = t.defaultCards;
        setCards(defaultCards);
        localStorage.setItem(`harmony_coping_cards_${language}`, JSON.stringify(defaultCards));
      }
      setIsAdding(false);
      setNewCard('');
    }
  }, [isOpen, language]);

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

  const saveCard = () => {
    if (!newCard.trim()) return;
    const updated = [...cards, newCard.trim()];
    setCards(updated);
    localStorage.setItem(`harmony_coping_cards_${language}`, JSON.stringify(updated));
    setNewCard('');
    setIsAdding(false);
    setCurrentCardIndex(updated.length - 1);
  };

  const deleteCard = (index: number) => {
    const updated = cards.filter((_, i) => i !== index);
    setCards(updated);
    localStorage.setItem(`harmony_coping_cards_${language}`, JSON.stringify(updated));
    if (currentCardIndex >= updated.length) {
      setCurrentCardIndex(Math.max(0, updated.length - 1));
    }
  };

  const surfaceAlt = 'var(--color-surface-alt)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';
  const text = 'var(--color-text)';
  const muted = 'var(--color-text-muted)';

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
          aria-label={t.copingCards}
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
            <div className="p-6 flex items-center justify-between shrink-0" style={{ backgroundColor: primary, color: 'white' }}>
              <div className="flex items-center gap-3">
                <MailOpen className="w-6 h-6 text-white" />
                <h2 className="text-xl font-serif font-medium">{t.copingCards}</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 flex-1 overflow-y-auto no-scrollbar">
              {!isAdding ? (
                <div className="space-y-6">
                  <p className="text-sm text-center" style={{ color: muted }}>
                    {t.cardsDesc}
                  </p>

                  {cards.length > 0 ? (
                    <div className="relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentCardIndex}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-8 rounded-[var(--radius-lg)] min-h-[200px] flex items-center justify-center text-center relative"
                          style={{ backgroundColor: surfaceAlt, border: `1px solid ${border}` }}
                        >
                          <p className="text-lg md:text-xl font-medium leading-relaxed" style={{ color: text }}>
                            {cards[currentCardIndex]}
                          </p>
                          <button
                            onClick={() => deleteCard(currentCardIndex)}
                            className="absolute top-4 right-4 transition-colors hover:opacity-80"
                            style={{ color: muted }}
                            aria-label="Delete card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      </AnimatePresence>

                      <div className="flex items-center justify-between mt-6">
                        <button
                          onClick={() => setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length)}
                          className="p-3 rounded-full transition-colors"
                          style={{ backgroundColor: 'var(--color-surface)', border: `1px solid ${border}`, color: primary }}
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium" style={{ color: muted }}>
                          {currentCardIndex + 1} / {cards.length}
                        </span>
                        <button
                          onClick={() => setCurrentCardIndex((prev) => (prev + 1) % cards.length)}
                          className="p-3 rounded-full transition-colors"
                          style={{ backgroundColor: 'var(--color-surface)', border: `1px solid ${border}`, color: primary }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 rounded-[var(--radius-lg)]" style={{ backgroundColor: surfaceAlt, border: `1px solid ${border}` }}>
                      <p className="font-medium" style={{ color: primary }}>{t.noCards}</p>
                      <p className="text-sm mt-2" style={{ color: muted }}>{t.addSupportWords}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-3 font-medium rounded-[var(--radius-md)] transition-colors flex items-center justify-center gap-2"
                    style={{ backgroundColor: surfaceAlt, color: primary }}
                  >
                    <Plus className="w-5 h-5" />
                    {t.writeNewCard}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg" style={{ color: text }}>{t.newCardTitle}</h3>
                  <p className="text-sm" style={{ color: muted }}>{t.newCardDesc}</p>
                  <textarea
                    value={newCard}
                    onChange={(e) => setNewCard(e.target.value)}
                    placeholder={t.newCardPlaceholder}
                    className="w-full p-4 rounded-[var(--radius-lg)] min-h-[150px] resize-none focus:outline-none"
                    style={{
                      backgroundColor: surfaceAlt,
                      border: `1px solid ${border}`,
                      color: text,
                    }}
                    onFocus={(e) => { e.target.style.borderColor = primary; }}
                    onBlur={(e) => { e.target.style.borderColor = border; }}
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setIsAdding(false); setNewCard(''); }}
                      className="flex-1 py-3 font-medium rounded-[var(--radius-md)] transition-colors"
                      style={{ backgroundColor: 'var(--color-surface)', border: `1px solid ${border}`, color: primary }}
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={saveCard}
                      disabled={!newCard.trim()}
                      className="flex-1 py-3 text-white font-medium rounded-[var(--radius-md)] transition-colors disabled:opacity-50"
                      style={{ backgroundColor: primary }}
                    >
                      {t.save}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
