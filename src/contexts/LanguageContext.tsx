import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ru';

export const translations = {
  en: {
    newSession: 'New Session',
    breathe: 'Breathe',
    sounds: 'Sounds',
    cards: 'Cards',
    sensory: 'Sensory',
    sos: 'SOS',
    placeholder: 'Ask anything... I am here to help.',
    howAreYou: 'How are you feeling today?',
    takeYourTime: "Take your time. I'm listening.",
    quickReplies: [
      { emoji: "😔", short: "Feeling low", full: "I'm feeling very low today and need support." },
      { emoji: "🔋", short: "No energy", full: "I have absolutely no energy to do anything right now." },
      { emoji: "😰", short: "Anxious", full: "I'm feeling extremely anxious and overwhelmed." },
      { emoji: "🥺", short: "Can't speak", full: "I'm in a state where it's hard to find words. Please just be here with me." },
      { emoji: "🧩", short: "Distract me", full: "Tell me an interesting, random fact or story to distract me." }
    ],
    // Breathing Modal
    breatheIn: 'Breathe in...',
    hold: 'Hold...',
    breatheOut: 'Breathe out...',
    breatheMethod: '4-3-6 Breathing Method',
    groundYourself: 'Take a moment to ground yourself. Follow the circle.',
    // SOS Modal
    notAlone: 'You are not alone.',
    sosDesc: 'If you are experiencing a mental health crisis, feeling overwhelmed, or having thoughts of self-harm, please reach out to people who can help immediately.',
    call988: 'Call or Text 988',
    lifeline: 'Suicide & Crisis Lifeline (US & Canada). Available 24/7, free, and confidential.',
    findHelpline: 'Find A Helpline',
    intlHelpline: 'International resources and hotlines for your specific country.',
    visitHelpline: 'Visit findahelpline.com',
    returnChat: 'Return to chat',
    // Sound Modal
    soundTherapy: 'Sound Therapy',
    soundInfo: 'For the best effect (binaural beats), **you must use headphones**. Sit comfortably, close your eyes, and focus on your breathing.',
    theta: 'Theta Waves (6 Hz)',
    thetaDesc: 'Deep relaxation, meditation, anxiety reduction. Helps with severe stress.',
    alpha: 'Alpha Waves (10 Hz)',
    alphaDesc: 'Light relaxation, positive calmness, flow state. Great for calming the mind.',
    gamma: 'Gamma Waves (40 Hz)',
    gammaDesc: 'Peak concentration, mental clarity, cognitive enhancement. Helps to focus when lacking energy.',
    // Coping Cards
    copingCards: 'Coping Cards',
    cardsDesc: 'Letters to your future self. Reminders written in your bright moments to support you in hard times.',
    noCards: 'You have no cards yet.',
    addSupportWords: 'Add supporting words for yourself.',
    writeNewCard: 'Write a new card',
    newCardTitle: 'New Card',
    newCardDesc: 'Write a reminder that you will thank yourself for when things get hard.',
    newCardPlaceholder: 'For example: I appreciate myself for...',
    cancel: 'Cancel',
    save: 'Save',
    defaultCards: [
      "This state is temporary, it has passed before.",
      "Depression distorts my thoughts. What I feel now is not the absolute truth.",
      "I have the right to rest and be gentle with myself.",
      "I appreciate myself for continuing to fight, even when I have no energy."
    ]
  },
  ru: {
    newSession: 'Новая беседа',
    breathe: 'Дыхание',
    sounds: 'Звуки',
    cards: 'Карточки',
    sensory: 'Сенсорика',
    sos: 'SOS',
    placeholder: 'Спрашивайте о чем угодно... Я здесь, чтобы помочь.',
    howAreYou: 'Как вы себя чувствуете сегодня?',
    takeYourTime: "Не торопитесь. Я слушаю.",
    quickReplies: [
      { emoji: "😔", short: "Мне грустно", full: "Мне сегодня очень грустно и одиноко. Выслушай меня." },
      { emoji: "🔋", short: "Нет сил", full: "У меня совершенно нет сил что-либо делать. Руки опускаются." },
      { emoji: "😰", short: "Тревога", full: "Я чувствую сильную тревогу и панику, не могу успокоиться." },
      { emoji: "🥺", short: "Тяжело говорить", full: "Сил нет даже писать связно. Просто побудь со мной." },
      { emoji: "🧩", short: "Отвлеки меня", full: "Расскажи какой-нибудь интересный, случайный факт или историю, чтобы отвлечь меня." }
    ],
    // Breathing Modal
    breatheIn: 'Вдох...',
    hold: 'Задержка...',
    breatheOut: 'Выдох...',
    breatheMethod: 'Метод дыхания 4-3-6',
    groundYourself: 'Сделайте паузу, чтобы заземлиться. Следите за кругом.',
    // SOS Modal
    notAlone: 'Вы не одни.',
    sosDesc: 'Если вы переживаете кризис ментального здоровья, чувствуете себя подавленно или у вас есть мысли о причинении себе вреда, пожалуйста, немедленно обратитесь к тем, кто может помочь.',
    call988: 'Звоните 112 (РФ) или 988 (США)',
    lifeline: 'Бесплатная и конфиденциальная служба спасения. Доступна 24/7.',
    findHelpline: 'Найти горячую линию',
    intlHelpline: 'Международные ресурсы и горячие линии для вашей страны.',
    visitHelpline: 'Посетить findahelpline.com',
    returnChat: 'Вернуться в чат',
    // Sound Modal
    soundTherapy: 'Звуковая терапия',
    soundInfo: 'Для наилучшего эффекта (бинауральные ритмы) **обязательно используйте наушники**. Сядьте удобно, закройте глаза и сосредоточьтесь на дыхании.',
    theta: 'Тета-волны (6 Гц)',
    thetaDesc: 'Глубокая релаксация, медитация, снижение тревожности. Помогает при сильном стрессе.',
    alpha: 'Альфа-волны (10 Гц)',
    alphaDesc: 'Легкое расслабление, позитивное спокойствие, состояние потока. Отлично для успокоения ума.',
    gamma: 'Гамма-волны (40 Гц)',
    gammaDesc: 'Пиковая концентрация, ясность ума, когнитивное развитие. Помогает собраться при отсутствии энергии.',
    // Coping Cards
    copingCards: 'Коупинг-карточки',
    cardsDesc: 'Письма себе в будущее. Напоминания, написанные вами в светлые моменты, чтобы поддержать в трудную минуту.',
    noCards: 'У вас пока нет карточек.',
    addSupportWords: 'Добавьте поддерживающие слова для себя.',
    writeNewCard: 'Написать новую карточку',
    newCardTitle: 'Новая карточка',
    newCardDesc: 'Напишите напоминание, за которое вы скажете себе спасибо, когда вам будет тяжело.',
    newCardPlaceholder: 'Например: Я ценю себя за то, что...',
    cancel: 'Отмена',
    save: 'Сохранить',
    defaultCards: [
      "Это состояние конечно, раньше оно тоже проходило.",
      "Депрессия искажает мои мысли. То, что я чувствую сейчас, не является абсолютной истиной.",
      "Я имею право на отдых и бережное отношение к себе.",
      "Я ценю себя за то, что продолжаю бороться, даже когда нет сил."
    ]
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.ru;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ru',
  setLanguage: () => {},
  t: translations.ru,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru');

  useEffect(() => {
    const saved = localStorage.getItem('harmony_language') as Language;
    if (saved === 'en' || saved === 'ru') {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('harmony_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
