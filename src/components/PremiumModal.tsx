import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Check, CreditCard, Wallet, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui';

type Plan = 'monthly' | 'yearly' | 'lifetime';
type Method = 'card' | 'paypal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
  loading?: boolean;
}

export default function PremiumModal({ isOpen, onClose, onActivate, loading }: Props) {
  const { language } = useLanguage();
  const [plan, setPlan] = useState<Plan>('yearly');
  const [method, setMethod] = useState<Method>('card');

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

  const isRu = language === 'ru';

  const plans: { id: Plan; title: string; price: string; period: string; badge?: string }[] = [
    { id: 'monthly', title: isRu ? 'Месяц' : 'Monthly', price: '$9.99', period: isRu ? '/мес' : '/mo' },
    { id: 'yearly', title: isRu ? 'Год' : 'Yearly', price: '$59.99', period: isRu ? '/год' : '/yr', badge: isRu ? '−50%' : 'Save 50%' },
    { id: 'lifetime', title: isRu ? 'Навсегда' : 'Lifetime', price: '$199', period: isRu ? 'единоразово' : 'once' },
  ];

  const benefits = isRu
    ? [
        'Безлимитные сообщения и сессии',
        'Все инструменты самопомощи открыты',
        'Приоритетные ответы ИИ-терапевта',
        'Безграничная история переписок',
      ]
    : [
        'Unlimited messages & sessions',
        'All wellness tools unlocked',
        'Priority AI therapist responses',
        'Unlimited chat history',
      ];

  const methods: { id: Method; icon: typeof CreditCard; label: string }[] = [
    { id: 'card', icon: CreditCard, label: isRu ? 'Банковская карта' : 'Credit / Debit Card' },
    { id: 'paypal', icon: Wallet, label: 'PayPal' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Harmony Premium"
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
            className="relative z-10 w-full max-w-md max-h-[92dvh] flex flex-col overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-elevated)]"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            {/* Header */}
            <div
              className="relative px-6 pt-7 pb-6 text-center overflow-hidden"
              style={{ backgroundColor: 'var(--color-premium-bg)' }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-black/5"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: 'var(--color-premium)', color: 'white' }}
              >
                <Crown className="w-7 h-7" />
              </motion.div>
              <h2 className="mt-3 text-2xl font-serif font-medium" style={{ color: 'var(--color-premium)' }}>
                Harmony Premium
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {isRu ? 'Откройте полный опыт терапии' : 'Unlock the full therapy experience'}
              </p>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 no-scrollbar">
              {/* Benefits — what Premium gives */}
              <ul className="space-y-2.5">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--color-premium-bg)', color: 'var(--color-premium)' }}
                    >
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Plan selection */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--color-text-muted)' }}>
                  {isRu ? 'Выберите тариф' : 'Choose your plan'}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map((p) => {
                    const selected = plan === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPlan(p.id)}
                        className="relative p-3 pt-4 rounded-[var(--radius-md)] text-center transition-all"
                        style={{
                          backgroundColor: selected ? 'var(--color-premium-bg)' : 'var(--color-surface-alt)',
                          border: `1.5px solid ${selected ? 'var(--color-premium)' : 'var(--color-border)'}`,
                        }}
                      >
                        {p.badge && (
                          <span
                            className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide text-white whitespace-nowrap"
                            style={{ backgroundColor: 'var(--color-premium)' }}
                          >
                            {p.badge}
                          </span>
                        )}
                        <div className="text-sm font-semibold" style={{ color: selected ? 'var(--color-premium)' : 'var(--color-text)' }}>
                          {p.title}
                        </div>
                        <div className="mt-1 text-base font-bold" style={{ color: 'var(--color-text)' }}>{p.price}</div>
                        <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{p.period}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment method selection */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'var(--color-text-muted)' }}>
                  {isRu ? 'Способ оплаты' : 'Payment method'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {methods.map((m) => {
                    const selected = method === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] transition-all"
                        style={{
                          backgroundColor: selected ? 'var(--color-premium-bg)' : 'var(--color-surface-alt)',
                          border: `1.5px solid ${selected ? 'var(--color-premium)' : 'var(--color-border)'}`,
                          color: selected ? 'var(--color-premium)' : 'var(--color-text)',
                        }}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-medium text-left leading-tight">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer / CTA */}
            <div
              className="px-6 py-4 border-t"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              <Button onClick={onActivate} icon={Crown} fullWidth size="lg" loading={loading}>
                {isRu ? 'Подключить Premium' : 'Activate Premium'}
              </Button>
              <p
                className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.15em]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <ShieldCheck className="w-3 h-3" />
                {isRu ? 'Безопасная оплата • Отмена в любой момент' : 'Secure payment • Cancel anytime'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
