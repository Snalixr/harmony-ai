import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { fetchApi } from '../lib/api';
import { ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { Button, Input, ErrorBanner } from '../components/ui';

const authTranslations = {
  en: {
    back: 'Back',
    welcome: 'Welcome',
    enterCode: 'Enter Verification Code',
    emailPrompt: 'Enter your email to sign in or create an account',
    codeSentTo: 'We sent an 8-digit code to',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    continueWithEmail: 'Continue with Email',
    verifyCode: 'Verify Code',
    wrongEmail: 'Wrong email? Go back',
    allDigitsRequired: 'Please enter all 8 digits',
    rateLimitHint: 'Too many code requests. You can still enter a code below if you already have one.',
  },
  ru: {
    back: 'Назад',
    welcome: 'Добро пожаловать',
    enterCode: 'Введите код подтверждения',
    emailPrompt: 'Введите email для входа или создания аккаунта',
    codeSentTo: 'Мы отправили 8-значный код на',
    emailLabel: 'Адрес электронной почты',
    emailPlaceholder: 'you@example.com',
    continueWithEmail: 'Продолжить',
    verifyCode: 'Подтвердить код',
    wrongEmail: 'Неверный email? Вернуться',
    allDigitsRequired: 'Пожалуйста, введите все 8 цифр',
    rateLimitHint: 'Слишком много запросов кода. Если у вас уже есть код — введите его ниже.',
  }
};

export default function AuthPage() {
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(8).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = authTranslations[language] || authTranslations.en;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setStep('verify');
    } catch (err: any) {
      const message = err?.message || '';
      // Rate limit from Supabase: still let the user through to the code screen so they can
      // use a dev code (or a code from a previously sent email) instead of being stuck.
      const isRateLimit = /rate limit|too many|over_email_send_rate/i.test(message);
      if (isRateLimit) {
        setError(t.rateLimitHint);
        setStep('verify');
      } else {
        setError(message || 'Failed to send code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 8) {
      setError(t.allDigitsRequired);
      return;
    }

    setError('');
    setIsLoading(true);

    // Developer bypass: if the entered code matches the dev login code, skip Supabase OTP entirely.
    const devCode = import.meta.env.VITE_DEV_LOGIN_CODE as string | undefined;
    if (devCode && fullCode === devCode) {
      try {
        const data = await fetchApi('/api/auth/dev-login', {
          method: 'POST',
          body: JSON.stringify({ code: fullCode }),
        });
        login(data.user, data.token);
        if (!data.user.onboarded) {
          navigate('/onboard');
        } else {
          navigate('/chat');
        }
      } catch (err: any) {
        setError(err.message || 'Dev login failed');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const { data: authData, error } = await supabase.auth.verifyOtp({ email, token: fullCode, type: 'email' });
      if (error) throw error;

      if (authData?.session) {
        const data = await fetchApi('/api/auth/sync', {
          method: 'POST',
          headers: { 'Authorization': authData.session.access_token }
        });

        login(data.user, authData.session.access_token);

        if (!data.user.onboarded) {
          navigate('/onboard');
        } else {
          navigate('/chat');
        }
      } else {
        throw new Error('Session not found after verification');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    if (value.length > 1) {
      const pasted = value.slice(0, 8).split('');
      pasted.forEach((char, i) => {
        if (index + i < 8) newCode[index + i] = char;
      });
      setCode(newCode);
      const nextInput = document.getElementById(`code-${Math.min(7, index + pasted.length)}`);
      nextInput?.focus();
      return;
    }

    newCode[index] = value;
    setCode(newCode);

    if (value && index < 7) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans" style={{ backgroundColor: 'var(--color-bg)' }}>
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 transition-colors hover:opacity-70" style={{ color: 'var(--color-text-muted)' }}>
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t.back}</span>
        </Link>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="p-8 sm:p-12 w-full max-w-md"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-elevated)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
              {step === 'email' ? t.welcome : t.enterCode}
            </h2>
            <p className="font-light" style={{ color: 'var(--color-text-muted)' }}>
              {step === 'email'
                ? t.emailPrompt
                : `${t.codeSentTo} ${email}`}
            </p>
          </div>

          <ErrorBanner message={error} />

          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <Input
                id="email"
                type="email"
                label={t.emailLabel}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
                autoFocus
              />
              <Button type="submit" loading={isLoading} disabled={!email} fullWidth size="lg">
                {t.continueWithEmail}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-8">
              <div className="flex justify-between gap-2 sm:gap-3">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`code-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={digit}
                    onChange={(e) => handleCodeChange(idx, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                    className="w-full aspect-[3/4] text-center text-2xl font-medium rounded-[var(--radius-lg)] focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-input-bg)',
                      border: '2px solid var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.backgroundColor = 'var(--color-surface)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.backgroundColor = 'var(--color-input-bg)';
                    }}
                    aria-label={`Digit ${idx + 1}`}
                    required
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <Button type="submit" loading={isLoading} disabled={code.some(d => !d)} fullWidth size="lg">
                {t.verifyCode}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setStep('email'); setError(''); }}
                  className="font-medium transition-colors text-sm hover:opacity-70"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t.wrongEmail}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
