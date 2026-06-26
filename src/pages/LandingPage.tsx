import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Shield, Brain, Clock, ChevronRight, ChevronDown,
  Globe, Sparkles, ArrowRight, MessageSquareHeart,
  Sun, Moon, Star, Quote, Check
} from 'lucide-react';
import { motion } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../contexts/ThemeContext';

const translations = {
  en: {
    signIn: "Sign In",
    digitalSanctuary: "AI Mental Health & Anxiety Support",
    findCenter: "Relieve stress & find calm with",
    harmony: "Harmony.",
    description: "Your personal 24/7 AI therapist. Rooted in Cognitive Behavioral Therapy (CBT), Harmony helps you overcome anxiety, manage stress, and improve your mental health.",
    startJourney: "Start Feeling Better",
    freeTrial: "Free trial. No credit card required.",
    corePrinciples: "Core Principles",
    designedForGrowth: "Mental Health Support Built for Growth",
    cbtFramework: "Science-Backed CBT",
    cbtDesc: "Our guided AI therapy conversations help you identify anxiety triggers, reframe negative thoughts, and develop positive coping mechanisms.",
    safePrivate: "100% Secure & Anonymous",
    safeDesc: "A private, judgment-free mental wellness space. Your chat data is heavily encrypted, ensuring your journey remains completely confidential.",
    alwaysAvailable: "24/7 Emotional Support",
    alwaysDesc: "Anxiety and panic attacks don't run on a schedule. Whether it's 3 AM or mid-workday, our AI is ready to listen and guide you.",
    personalized: "Personalized Tools for Growth",
    createAccount: "Set Your Wellness Goals",
    createDesc: "Take a quick psychological assessment to set your mental health and anxiety relief goals.",
    chatFreely: "Talk Therapy with AI",
    chatDesc: "Express your feelings securely with our empathetic, CBT-trained emotional support AI.",
    buildResilience: "Track Your Mental Growth",
    buildDesc: "Review your mood logs and session history to build resilience and track cognitive improvements.",
    cbtSession: "Interactive CBT Session",
    topic: "Topic: Managing Panic & Anxiety",
    chatBubble1: "That sounds like a heavy burden to carry. This sounds like it might be 'all-or-nothing thinking'. Could we explore a specific situation where you felt this failure?",
    chatBubble2: "I made a mistake in a report and thought I'd be fired.",
    disclaimer: "Designed for personal growth and mental wellness. Not a substitute for professional clinical treatment.",
    // Testimonials
    testimonialsTitle: "Trusted by Those Who Needed Support",
    testimonialsSubtitle: "Real experiences from people who found calm through Harmony.",
    testimonial1Quote: "Harmony helped me recognize thought patterns I'd been stuck in for years. The breathing exercises alone changed how I handle panic attacks.",
    testimonial1Name: "Alex M.",
    testimonial1Role: "Software Engineer, 28",
    testimonial2Quote: "I was skeptical about AI therapy, but the empathy felt genuine. It's like having a patient, non-judgmental friend at 3 AM.",
    testimonial2Name: "Maria K.",
    testimonial2Role: "University Student, 22",
    testimonial3Quote: "The coping cards feature is brilliant — I wrote affirmations during good days and they genuinely help me through the hard ones.",
    testimonial3Name: "James L.",
    testimonial3Role: "Teacher, 35",
    // FAQ
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Is Harmony a replacement for professional therapy?",
    faqA1: "Harmony is a complementary wellness tool based on CBT principles. It is not a substitute for professional clinical treatment. If you are experiencing severe mental health challenges, please consult a licensed therapist.",
    faqQ2: "Is my conversation data private?",
    faqA2: "Absolutely. All conversations are end-to-end encrypted. We do not share your data with third parties, and you can delete your data at any time.",
    faqQ3: "How does the free trial work?",
    faqA3: "You get 10 free messages to try Harmony. No credit card required. After that, you can upgrade to Premium for unlimited sessions.",
    faqQ4: "What languages does Harmony support?",
    faqA4: "Harmony currently supports English and Russian, with more languages being added soon.",
    faqQ5: "Can I use Harmony offline?",
    faqA5: "The breathing exercises, coping cards, and sensory canvas work offline. Chat features require an internet connection.",
    // Pricing
    pricingTitle: "Simple, Transparent Pricing",
    pricingSubtitle: "Start free, upgrade when you're ready.",
    freePlanName: "Free",
    freePlanPrice: "$0",
    freePlanPeriod: "forever",
    premiumPlanName: "Premium",
    premiumPlanPrice: "$9.99",
    premiumPlanPeriod: "/month",
    featureMessages10: "10 free messages",
    featureMessagesUnlimited: "Unlimited messages",
    featureBreathing: "Breathing exercises",
    featureSounds: "Sound therapy",
    featureCards: "Coping cards",
    featureSensory: "Sensory canvas",
    featureSOS: "SOS crisis resources",
    featureSessionHistory: "Session history",
    featurePriority: "Priority support",
    featureEarly: "Early access to new features",
    ctaPremium: "Get Premium",
    ctaFree: "Start Free Trial",
    popularBadge: "Most Popular",
  },
  ru: {
    signIn: "Войти",
    digitalSanctuary: "ИИ-поддержка при тревоге и стрессе",
    findCenter: "Снимите стресс и найдите баланс с",
    harmony: "Harmony.",
    description: "Ваш личный ИИ-терапевт, доступный 24/7. Основанная на методах когнитивно-поведенческой терапии (КПТ), Harmony помогает справиться с тревогой и депрессией.",
    startJourney: "Начать путь к спокойствию",
    freeTrial: "Попробуйте бесплатно.",
    corePrinciples: "Наши принципы",
    designedForGrowth: "Терапия для вашего развития",
    cbtFramework: "Научный подход КПТ",
    cbtDesc: "Наш ИИ-психолог поможет распознать триггеры тревоги, изменить негативные мысли и выработать привычки справляться со стрессом.",
    safePrivate: "Полная анонимность",
    safeDesc: "Среда без осуждения. Ваши данные надежно зашифрованы, что гарантирует полную конфиденциальность ваших сессий.",
    alwaysAvailable: "Поддержка 24/7",
    alwaysDesc: "Панические атаки не знают расписания. Будь то 3 ночи или разгар рабочего дня, бот-психолог всегда готов вас выслушать.",
    personalized: "Индивидуальный подход",
    createAccount: "Определение целей",
    createDesc: "Пройдите диагностику для постановки целей по снижению уровня тревожности и стресса.",
    chatFreely: "Терапия в чате с ИИ",
    chatDesc: "Делитесь своими переживаниями в безопасном чате с эмпатичным ИИ, обученным КПТ.",
    buildResilience: "Отслеживание прогресса",
    buildDesc: "Анализируйте историю сессий и дневник настроения для отслеживания своего когнитивного роста.",
    cbtSession: "Сессия КПТ-терапии",
    topic: "Тема: Управление тревогой и стрессом",
    chatBubble1: "Звучит как тяжелая ноша. Возможно, это 'черно-белое мышление'. Можем ли мы разобрать конкретную ситуацию, где вы почувствовали этот провал?",
    chatBubble2: "Я сделал ошибку в отчете и подумал, что меня уволят.",
    disclaimer: "Создано для поддержки ментального здоровья. Не является заменой клинического лечения.",
    // Testimonials
    testimonialsTitle: "Доверяют те, кому нужна поддержка",
    testimonialsSubtitle: "Реальные истории людей, нашедших спокойствие с Harmony.",
    testimonial1Quote: "Harmony помог мне распознать шаблоны мышления, в которых я застрял годами. Одни дыхательные упражнения изменили то, как я справляюсь с паническими атаками.",
    testimonial1Name: "Алексей М.",
    testimonial1Role: "Программист, 28 лет",
    testimonial2Quote: "Я скептически относился к ИИ-терапии, но эмпатия ощущалась настоящей. Как будто есть терпеливый, безоценочный друг в 3 часа ночи.",
    testimonial2Name: "Мария К.",
    testimonial2Role: "Студентка, 22 года",
    testimonial3Quote: "Функция коупинг-карточек — гениальная идея. Я писал аффирмации в хорошие дни, и они реально помогают в трудные моменты.",
    testimonial3Name: "Дмитрий Л.",
    testimonial3Role: "Учитель, 35 лет",
    // FAQ
    faqTitle: "Часто задаваемые вопросы",
    faqQ1: "Harmony заменяет профессиональную терапию?",
    faqA1: "Harmony — это дополнительный инструмент для улучшения ментального здоровья, основанный на принципах КПТ. Он не заменяет профессиональное клиническое лечение. При серьёзных проблемах обратитесь к лицензированному терапевту.",
    faqQ2: "Мои данные конфиденциальны?",
    faqA2: "Абсолютно. Все разговоры зашифрованы. Мы не передаём данные третьим лицам, а вы можете удалить свои данные в любой момент.",
    faqQ3: "Как работает бесплатный пробный период?",
    faqA3: "Вы получаете 10 бесплатных сообщений. Без кредитной карты. После этого можно перейти на Premium для безлимитных сессий.",
    faqQ4: "На каких языках работает Harmony?",
    faqA4: "Harmony сейчас поддерживает русский и английский языки. Скоро появятся и другие.",
    faqQ5: "Можно ли использовать Harmony офлайн?",
    faqA5: "Дыхательные упражнения, коупинг-карточки и сенсорный холст работают офлайн. Чат требует интернет-соединения.",
    // Pricing
    pricingTitle: "Простое и прозрачное ценообразование",
    pricingSubtitle: "Начните бесплатно, переходите на Premium когда будете готовы.",
    freePlanName: "Бесплатно",
    freePlanPrice: "$0",
    freePlanPeriod: "навсегда",
    premiumPlanName: "Premium",
    premiumPlanPrice: "$9.99",
    premiumPlanPeriod: "/мес",
    featureMessages10: "10 бесплатных сообщений",
    featureMessagesUnlimited: "Безлимитные сообщения",
    featureBreathing: "Дыхательные упражнения",
    featureSounds: "Звуковая терапия",
    featureCards: "Коупинг-карточки",
    featureSensory: "Сенсорный холст",
    featureSOS: "Ресурсы SOS",
    featureSessionHistory: "История сессий",
    featurePriority: "Приоритетная поддержка",
    featureEarly: "Ранний доступ к новым функциям",
    ctaPremium: "Подключить Premium",
    ctaFree: "Начать бесплатно",
    popularBadge: "Популярный",
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-[var(--color-border)] last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
      >
        <span className="text-base font-medium pr-4" style={{ color: 'var(--color-text)' }}>
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--color-text-muted)' }}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm leading-relaxed font-light" style={{ color: 'var(--color-text-secondary)' }}>
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const [lang, setLang] = useState<'en' | 'ru'>('en');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => setLang(l => l === 'en' ? 'ru' : 'en');

  return (
    <PageTransition>
      <div className="min-h-screen font-sans selection:bg-[var(--color-primary-light)] overflow-x-hidden" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        {/* Dynamic Background Blurs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex justify-center items-center">
          <div
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[100px] animate-pulse-soft"
            style={{ backgroundColor: 'var(--color-border-light)', animationDuration: '8s' }}
          />
          <div
            className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-soft"
            style={{ backgroundColor: 'var(--color-surface-alt)', animationDuration: '10s', animationDelay: '2s' }}
          />
        </div>

        {/* Navigation */}
        <nav
          className={`h-20 flex items-center justify-between px-6 md:px-12 fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
            scrolled
              ? 'py-0 shadow-[var(--shadow-card)] backdrop-blur-xl'
              : 'py-2'
          }`}
          style={{
            backgroundColor: scrolled ? 'color-mix(in srgb, var(--color-bg) 80%, transparent)' : 'transparent',
            borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center shadow-lg transform rotate-3"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}
            >
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-serif font-medium tracking-tight" style={{ color: 'var(--color-text)' }}>
              Harmony
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-alt)] transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider hover:opacity-80 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Globe className="w-4 h-4" />
              {lang}
            </button>
            <Link
              to="/auth"
              className="px-6 py-2.5 text-sm font-medium rounded-full shadow-[var(--shadow-card)] transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            >
              {t.signIn}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-alt)] transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-alt)] transition-colors"
              style={{ color: 'var(--color-text)' }}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 left-0 right-0 z-40 p-4 backdrop-blur-xl border-b"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-bg) 95%, transparent)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <button
                onClick={toggleLang}
                className="flex items-center justify-center gap-2 py-3 rounded-[var(--radius-lg)] text-sm font-medium"
                style={{ backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-text)' }}
              >
                <Globe className="w-4 h-4" />
                {lang === 'en' ? 'English' : 'Русский'}
                <ChevronRight className="w-4 h-4 ml-auto" style={{ color: 'var(--color-text-muted)' }} />
              </button>
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center py-3 rounded-[var(--radius-lg)] text-sm font-medium"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}
              >
                {t.signIn}
              </Link>
            </div>
          </motion.div>
        )}

        <main className="relative z-10 pt-20">
          {/* ===================== Hero Section ===================== */}
          <section className="min-h-[85vh] flex flex-col justify-center items-center px-6 py-20 pb-24 text-center max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8 flex flex-col items-center"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-[var(--shadow-card)] backdrop-blur-sm text-xs font-medium uppercase tracking-wider" style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface) 50%, transparent)', border: '1px solid var(--color-border)', color: 'var(--color-primary)' }}>
                <Sparkles className="w-3.5 h-3.5" />
                {t.digitalSanctuary}
              </motion.div>

              <motion.div variants={fadeInUp} className="max-w-4xl space-y-4">
                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif tracking-tight leading-[1.05]" style={{ color: 'var(--color-text)' }}>
                  {t.findCenter} <span className="italic" style={{ color: 'var(--color-primary-muted)' }}>{t.harmony}</span>
                </h1>
              </motion.div>

              <motion.p variants={fadeInUp} className="text-lg md:text-xl md:leading-relaxed max-w-2xl font-light" style={{ color: 'var(--color-text-secondary)' }}>
                {t.description}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-5 pt-8">
                <Link
                  to="/auth"
                  className="group relative px-8 py-4 text-white rounded-full font-medium text-lg overflow-hidden flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: 'var(--color-primary)', boxShadow: 'var(--shadow-primary)' }}
                >
                  <span className="relative z-10">{t.startJourney}</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer z-0" />
                </Link>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  {t.freeTrial}
                </span>
              </motion.div>
            </motion.div>
          </section>

          {/* ===================== Features Section ===================== */}
          <section className="py-24 md:py-32 border-y" style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface) 60%, transparent)', borderColor: 'var(--color-border)' }}>
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-16 md:mb-20"
              >
                <motion.h2 variants={fadeInUp} className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-muted)' }}>{t.corePrinciples}</motion.h2>
                <motion.h3 variants={fadeInUp} className="text-3xl md:text-5xl font-serif tracking-tight" style={{ color: 'var(--color-text)' }}>{t.designedForGrowth}</motion.h3>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {/* Feature 1 — CBT */}
                <motion.div variants={fadeInUp} className="group hover:-translate-y-1 transition-all duration-500" style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-light)' }}>
                  <div className="p-10">
                    <div className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                      <Brain className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-serif font-medium mb-4" style={{ color: 'var(--color-text)' }}>{t.cbtFramework}</h4>
                    <p className="leading-relaxed font-light" style={{ color: 'var(--color-text-secondary)' }}>{t.cbtDesc}</p>
                  </div>
                </motion.div>

                {/* Feature 2 — Security */}
                <motion.div variants={fadeInUp} className="group hover:-translate-y-1 transition-all duration-500" style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-light)' }}>
                  <div className="p-10">
                    <div className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: '#FCF5F3', color: '#8B6B67' }}>
                      <Shield className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-serif font-medium mb-4" style={{ color: 'var(--color-text)' }}>{t.safePrivate}</h4>
                    <p className="leading-relaxed font-light" style={{ color: 'var(--color-text-secondary)' }}>{t.safeDesc}</p>
                  </div>
                </motion.div>

                {/* Feature 3 — 24/7 */}
                <motion.div variants={fadeInUp} className="group hover:-translate-y-1 transition-all duration-500" style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-light)' }}>
                  <div className="p-10">
                    <div className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: '#F0F2F6', color: '#4B5E7A' }}>
                      <Clock className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-serif font-medium mb-4" style={{ color: 'var(--color-text)' }}>{t.alwaysAvailable}</h4>
                    <p className="leading-relaxed font-light" style={{ color: 'var(--color-text-secondary)' }}>{t.alwaysDesc}</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ===================== How it Works + Chat Preview ===================== */}
          <section className="py-24 md:py-32 px-6 max-w-6xl mx-auto overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-16 md:gap-20">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="flex-1 space-y-10 order-2 md:order-1"
              >
                <div className="space-y-4 text-center md:text-left">
                  <motion.div variants={fadeInUp} className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center mb-6 mx-auto md:mx-0" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                    <MessageSquareHeart className="w-6 h-6" />
                  </motion.div>
                  <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight leading-tight" style={{ color: 'var(--color-text)' }}>
                    {t.personalized}
                  </motion.h2>
                </div>

                <div className="space-y-8">
                  {[
                    { title: t.createAccount, desc: t.createDesc },
                    { title: t.chatFreely, desc: t.chatDesc },
                    { title: t.buildResilience, desc: t.buildDesc }
                  ].map((step, i) => (
                    <motion.div key={i} variants={fadeInUp} className="flex gap-6 group">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-colors shadow-[var(--shadow-card)]"
                          style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }}
                        >
                          {i + 1}
                        </div>
                        {i < 2 && <div className="w-px h-full my-2" style={{ backgroundColor: 'var(--color-border)' }} />}
                      </div>
                      <div className="pb-8">
                        <h5 className="text-xl font-medium mb-2" style={{ color: 'var(--color-text)' }}>{step.title}</h5>
                        <p className="font-light leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="flex-1 w-full relative order-1 md:order-2"
              >
                {/* Decorative glow */}
                <div className="absolute top-[-10%] right-[-10%] w-full h-full rounded-[50px] rotate-3 blur-2xl opacity-60 -z-10" style={{ background: 'linear-gradient(to bottom right, var(--color-border-light), var(--color-surface-alt))' }} />

                <div className="overflow-hidden flex flex-col mx-auto max-w-sm" style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-elevated)', border: '1px solid var(--color-border-light)' }}>
                  {/* Chat App Header */}
                  <div className="px-6 py-5 flex items-center gap-4 relative z-10 border-b" style={{ backgroundColor: 'var(--color-surface-elevated)', borderColor: 'var(--color-border-light)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>Harmony AI</h3>
                      <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-muted)' }}>Active Session</p>
                    </div>
                  </div>

                  {/* Chat App Body */}
                  <div className="p-6 space-y-6 relative z-0 hide-scrollbar" style={{ backgroundColor: 'var(--color-surface-alt)', backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                    <div className="flex justify-center mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-[var(--shadow-card)]" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>Today</span>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      viewport={{ once: true }}
                      className="flex gap-3 max-w-[90%]"
                    >
                      <div className="p-4 rounded-[var(--radius-lg)] rounded-tl-sm text-[13px] leading-relaxed shadow-[var(--shadow-card)]" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                        {t.chatBubble1}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      viewport={{ once: true }}
                      className="flex gap-3 max-w-[90%] ml-auto flex-row-reverse"
                    >
                      <div className="p-4 rounded-[var(--radius-lg)] rounded-tr-sm text-[13px] leading-relaxed text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                        {t.chatBubble2}
                      </div>
                    </motion.div>

                    {/* Typing Indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      viewport={{ once: true }}
                      className="flex gap-1.5 px-4 py-2 w-max rounded-full shadow-[var(--shadow-card)]"
                      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                    >
                      {[0, 150, 300].map((delay) => (
                        <div key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-text-muted)', animationDelay: `${delay}ms` }} />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ===================== Testimonials Section ===================== */}
          <section className="py-24 md:py-32 border-y" style={{ backgroundColor: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}>
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif tracking-tight mb-4" style={{ color: 'var(--color-text)' }}>{t.testimonialsTitle}</motion.h2>
                <motion.p variants={fadeInUp} className="text-lg font-light max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>{t.testimonialsSubtitle}</motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {[
                  { quote: t.testimonial1Quote, name: t.testimonial1Name, role: t.testimonial1Role },
                  { quote: t.testimonial2Quote, name: t.testimonial2Name, role: t.testimonial2Role },
                  { quote: t.testimonial3Quote, name: t.testimonial3Name, role: t.testimonial3Role },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="p-8"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <Quote className="w-8 h-8 mb-4" style={{ color: 'var(--color-primary-light)', stroke: 'var(--color-primary)' }} />
                    <p className="leading-relaxed mb-6 font-light" style={{ color: 'var(--color-text-secondary)' }}>{item.quote}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                        <Star className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ===================== Pricing Section ===================== */}
          <section className="py-24 md:py-32" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="max-w-5xl mx-auto px-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif tracking-tight mb-4" style={{ color: 'var(--color-text)' }}>{t.pricingTitle}</motion.h2>
                <motion.p variants={fadeInUp} className="text-lg font-light max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>{t.pricingSubtitle}</motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
              >
                {/* Free Plan */}
                <motion.div
                  variants={fadeInUp}
                  className="p-8"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <h3 className="text-xl font-serif font-medium mb-2" style={{ color: 'var(--color-text)' }}>{t.freePlanName}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-serif font-medium" style={{ color: 'var(--color-text)' }}>{t.freePlanPrice}</span>
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t.freePlanPeriod}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[t.featureMessages10, t.featureBreathing, t.featureSounds, t.featureCards, t.featureSensory, t.featureSOS].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/auth"
                    className="block text-center py-3.5 rounded-[var(--radius-lg)] text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}
                  >
                    {t.ctaFree}
                  </Link>
                </motion.div>

                {/* Premium Plan */}
                <motion.div
                  variants={fadeInUp}
                  className="p-8 relative"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-xl)',
                    border: '2px solid var(--color-primary)',
                    boxShadow: 'var(--shadow-primary)',
                  }}
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                    {t.popularBadge}
                  </span>
                  <h3 className="text-xl font-serif font-medium mb-2" style={{ color: 'var(--color-text)' }}>{t.premiumPlanName}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-serif font-medium" style={{ color: 'var(--color-text)' }}>{t.premiumPlanPrice}</span>
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t.premiumPlanPeriod}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[t.featureMessagesUnlimited, t.featureBreathing, t.featureSounds, t.featureCards, t.featureSensory, t.featureSOS, t.featureSessionHistory, t.featurePriority, t.featureEarly].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/auth"
                    className="block text-center py-3.5 rounded-[var(--radius-lg)] text-sm font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {t.ctaPremium}
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ===================== FAQ Section ===================== */}
          <section className="py-24 md:py-32 border-t" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
            <div className="max-w-3xl mx-auto px-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif tracking-tight mb-4" style={{ color: 'var(--color-text)' }}>{t.faqTitle}</motion.h2>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="p-8 sm:p-10"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {[
                  { q: t.faqQ1, a: t.faqA1 },
                  { q: t.faqQ2, a: t.faqA2 },
                  { q: t.faqQ3, a: t.faqA3 },
                  { q: t.faqQ4, a: t.faqA4 },
                  { q: t.faqQ5, a: t.faqA5 },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <FAQItem question={item.q} answer={item.a} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ===================== Footer ===================== */}
          <footer className="border-t relative z-10" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
            <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                  <Heart className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <span className="font-serif font-medium" style={{ color: 'var(--color-text)' }}>Harmony AI</span>
              </div>
              <p className="text-xs text-center md:text-right max-w-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {t.disclaimer}
              </p>
            </div>
          </footer>
        </main>
      </div>
    </PageTransition>
  );
}
