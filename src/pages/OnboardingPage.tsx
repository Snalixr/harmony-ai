import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchApi } from '../lib/api';
import { motion } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { Button, ErrorBanner } from '../components/ui';

const onboardTranslations = {
  en: {
    title: "Let's get to know you",
    subtitle: "Tell us a bit about yourself so your AI therapist can better support you.",
    nameLabel: "What should we call you?",
    namePlaceholder: "Your preferred name",
    ageLabel: "Your age",
    agePlaceholder: "Age",
    concernsLabel: "What are your primary concerns right now?",
    concernsPlaceholder: "e.g. Managing anxiety at work, sleep issues, relationship stress...",
    goalsLabel: "What are your goals for therapy?",
    goalsPlaceholder: "e.g. Learn coping mechanisms, improve self-esteem...",
    allFieldsRequired: "Please fill out all fields.",
    startSession: "Start Session",
    errorGeneric: "An error occurred during onboarding.",
  },
  ru: {
    title: "Давайте познакомимся",
    subtitle: "Расскажите немного о себе, чтобы ИИ-терапевт мог лучше вас поддержать.",
    nameLabel: "Как к вам обращаться?",
    namePlaceholder: "Ваше имя",
    ageLabel: "Ваш возраст",
    agePlaceholder: "Возраст",
    concernsLabel: "Что вас сейчас больше всего беспокоит?",
    concernsPlaceholder: "Например: тревога на работе, проблемы со сном, стресс в отношениях...",
    goalsLabel: "Каковы ваши цели в терапии?",
    goalsPlaceholder: "Например: научиться справляться со стрессом, повысить самооценку...",
    allFieldsRequired: "Пожалуйста, заполните все поля.",
    startSession: "Начать сессию",
    errorGeneric: "Произошла ошибка при настройке профиля.",
  }
};

export default function OnboardingPage() {
  const { user, setUser } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = onboardTranslations[language] || onboardTranslations.en;

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [concerns, setConcerns] = useState('');
  const [goals, setGoals] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (user.onboarded) {
      navigate('/chat');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !concerns || !goals) {
      setError(t.allFieldsRequired);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const data = await fetchApi('/api/user/onboard', {
        method: 'POST',
        body: JSON.stringify({ name, age, concerns, goals }),
      });
      setUser(data.user);
      navigate('/chat');
    } catch (err: any) {
      setError(err.message || t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.onboarded) return null;

  const textareaClasses = `w-full px-5 py-4 rounded-[var(--radius-lg)] focus:outline-none transition-all`;
  const textareaStyle = {
    backgroundColor: 'var(--color-input-bg)',
    border: '2px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="p-8 sm:p-12 w-full max-w-2xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-elevated)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
              {t.title}
            </h2>
            <p className="font-light" style={{ color: 'var(--color-text-muted)' }}>
              {t.subtitle}
            </p>
          </div>

          <ErrorBanner message={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1" style={{ color: 'var(--color-text-muted)' }}>{t.nameLabel}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-[var(--radius-lg)] focus:outline-none transition-all"
                  style={textareaStyle}
                  placeholder={t.namePlaceholder}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = 'var(--color-surface)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.backgroundColor = 'var(--color-input-bg)'; }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1" style={{ color: 'var(--color-text-muted)' }}>{t.ageLabel}</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-5 py-4 rounded-[var(--radius-lg)] focus:outline-none transition-all"
                  style={textareaStyle}
                  placeholder={t.agePlaceholder}
                  min="13"
                  max="120"
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = 'var(--color-surface)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.backgroundColor = 'var(--color-input-bg)'; }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1" style={{ color: 'var(--color-text-muted)' }}>{t.concernsLabel}</label>
              <textarea
                value={concerns}
                onChange={(e) => setConcerns(e.target.value)}
                rows={3}
                className={textareaClasses}
                style={textareaStyle}
                placeholder={t.concernsPlaceholder}
                onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = 'var(--color-surface)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.backgroundColor = 'var(--color-input-bg)'; }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1" style={{ color: 'var(--color-text-muted)' }}>{t.goalsLabel}</label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={3}
                className={textareaClasses}
                style={textareaStyle}
                placeholder={t.goalsPlaceholder}
                onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = 'var(--color-surface)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.backgroundColor = 'var(--color-input-bg)'; }}
              />
            </div>

            <Button type="submit" loading={isLoading} fullWidth size="lg" className="mt-8">
              {t.startSession}
            </Button>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
}
