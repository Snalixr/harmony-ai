import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { fetchApi } from '../lib/api';
import type { Chat, Message } from '../types';
import {
  LogOut, Plus, MessageSquare, Send, Crown, AlertOctagon,
  Loader2, Wind, ShieldAlert, Headphones, MailOpen, Sparkles,
  Globe, Menu, X, Heart, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PageTransition from '../components/PageTransition';
import AuroraBackground from '../components/AuroraBackground';
import { Button, ErrorBanner } from '../components/ui';
import BreathingModal from '../components/BreathingModal';
import SOSModal from '../components/SOSModal';
import SoundModal from '../components/SoundModal';
import CopingCardsModal from '../components/CopingCardsModal';
import SensoryCanvasModal from '../components/SensoryCanvasModal';
import PremiumModal from '../components/PremiumModal';

function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function ChatScreen() {
  const { user, logout, setUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isSoundOpen, setIsSoundOpen] = useState(false);
  const [isCopingCardsOpen, setIsCopingCardsOpen] = useState(false);
  const [isSensoryOpen, setIsSensoryOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isActivatingPremium, setIsActivatingPremium] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (!user.onboarded) {
      navigate('/onboard');
    } else {
      loadChats();
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    }
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChats = async () => {
    try {
      const data = await fetchApi('/api/chats');
      setChats(data.chats);
      if (data.chats.length > 0 && !activeChatId) {
        setActiveChatId(data.chats[0].id);
      }
    } catch (e) {
      console.error('Failed to load chats');
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const data = await fetchApi(`/api/chats/${chatId}/messages`);
      setMessages(data.messages);
    } catch (e) {
      console.error('Failed to load messages');
    }
  };

  const createChat = async () => {
    try {
      const data = await fetchApi('/api/chats', { method: 'POST' });
      setChats([data.chat, ...chats]);
      setActiveChatId(data.chat.id);
      setMessages([]);
    } catch (e) {
      console.error('Failed to create chat');
    }
  };

  const sendMessage = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    setSendError('');

    const textToSend = overrideText || input;
    if (!textToSend.trim() || activeChatId === null || isSending) return;

    if (!user?.is_subscribed && user?.free_messages_left <= 0) {
      return;
    }

    if (!overrideText) {
      setInput('');
    }
    setIsSending(true);

    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, chat_id: activeChatId, role: 'user', content: textToSend, created_at: new Date().toISOString() }]);

    try {
      const data = await fetchApi(`/api/chats/${activeChatId}/message`, {
        method: 'POST',
        body: JSON.stringify({ content: textToSend }),
      });

      setMessages(prev => prev.filter(m => m.id !== tempId).concat([data.userMessage, data.modelMessage]));
      setUser(data.user);

      if (messages.length === 0) {
        loadChats();
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setSendError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const openPremium = () => setIsPremiumOpen(true);

  const activatePremium = async () => {
    setIsActivatingPremium(true);
    try {
      const data = await fetchApi('/api/user/subscribe', { method: 'POST' });
      setUser(data.user);
      setIsPremiumOpen(false);
    } catch (e) {
      console.error('Failed to subscribe');
    } finally {
      setIsActivatingPremium(false);
    }
  };

  const isLocked = !user?.is_subscribed && (user?.free_messages_left || 0) <= 0;

  if (!user) return null;

  const brandColor = 'var(--color-primary)';
  const bgColor = 'var(--color-bg)';
  const surfaceColor = 'var(--color-surface)';
  const surfaceAltColor = 'var(--color-surface-alt)';
  const textColor = 'var(--color-text)';
  const textMutedColor = 'var(--color-text-muted)';
  const borderColor = 'var(--color-border)';

  return (
    <PageTransition>
      <div className="flex h-screen font-sans selection:bg-[var(--color-primary-light)]" style={{ backgroundColor: bgColor, color: textColor }}>
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-40 backdrop-blur-sm"
              style={{ backgroundColor: 'color-mix(in srgb, #2d2d2a 20%, transparent)' }}
            />
          )}
        </AnimatePresence>

        {/* =================== Sidebar =================== */}
        <div
          className={`fixed md:relative top-0 left-0 bottom-0 w-[85%] max-w-[320px] md:w-80 flex flex-col z-50 transition-transform duration-300 flex-shrink-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          style={{
            backgroundColor: surfaceColor,
            borderRight: `1px solid ${borderColor}`,
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Sidebar Header */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shadow-sm transform rotate-3"
                style={{ backgroundColor: brandColor, color: 'var(--color-bg)' }}
              >
                <Heart className="w-4.5 h-4.5 fill-current" />
              </div>
              <h2 className="text-lg font-serif font-medium" style={{ color: brandColor }}>
                Harmony
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-[var(--radius-sm)] transition-colors hover:opacity-80 hidden md:flex"
                style={{ backgroundColor: surfaceAltColor, color: brandColor }}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
                className="p-2 rounded-[var(--radius-sm)] text-[10px] font-semibold uppercase transition-colors hover:opacity-80 hidden md:flex items-center gap-1"
                style={{ backgroundColor: surfaceAltColor, color: brandColor }}
              >
                <Globe className="w-3.5 h-3.5" />
                {language}
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 -mr-2 md:hidden"
                style={{ color: brandColor }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* New Session + Tools */}
          <div className="px-4 pb-4 space-y-3">
            <button
              onClick={() => { createChat(); setIsSidebarOpen(false); }}
              className="w-full py-3 px-4 rounded-[var(--radius-lg)] font-medium flex items-center justify-between transition-colors shadow-[var(--shadow-card)]"
              style={{ backgroundColor: surfaceColor, border: `1px solid ${brandColor}`, color: brandColor }}
            >
              <span>{t.newSession}</span>
              <Plus className="w-5 h-5" />
            </button>

            {/* Wellness tools grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Wind, label: t.breathe, onClick: () => setIsBreathingOpen(true), color: '#6B8A78' },
                { icon: Headphones, label: t.sounds, onClick: () => setIsSoundOpen(true), color: '#4B5E7A' },
                { icon: MailOpen, label: t.cards, onClick: () => setIsCopingCardsOpen(true), color: '#8B6B67' },
                { icon: Sparkles, label: t.sensory, onClick: () => setIsSensoryOpen(true), color: '#7C6BAE' },
              ].map((tool, i) => (
                <button
                  key={i}
                  onClick={() => { tool.onClick(); setIsSidebarOpen(false); }}
                  className="py-2.5 px-2 rounded-[var(--radius-md)] flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: surfaceAltColor, color: brandColor }}
                >
                  <tool.icon className="w-4 h-4" />
                  <span className="text-[11px] font-medium">{tool.label}</span>
                </button>
              ))}
              <button
                onClick={() => { setIsSOSOpen(true); setIsSidebarOpen(false); }}
                className="col-span-2 py-2.5 px-2 rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-colors"
                style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)' }}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">{t.sos}</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px" style={{ backgroundColor: borderColor }} />

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 no-scrollbar">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => { setActiveChatId(chat.id); setIsSidebarOpen(false); }}
                className="w-full text-left py-3 px-4 rounded-[var(--radius-md)] flex items-center gap-3 transition-colors"
                style={{
                  backgroundColor: activeChatId === chat.id ? surfaceAltColor : 'transparent',
                  color: activeChatId === chat.id ? brandColor : textMutedColor,
                  fontWeight: activeChatId === chat.id ? 500 : 400,
                  border: activeChatId === chat.id ? `1px solid ${borderColor}` : '1px solid transparent',
                }}
              >
                <MessageSquare className="w-4 h-4 shrink-0" style={{ opacity: activeChatId === chat.id ? 1 : 0.5 }} />
                <span className="truncate flex-1 text-sm">{chat.title}</span>
              </button>
            ))}
          </div>

          {/* User panel */}
          <div className="p-4 border-t" style={{ borderColor: borderColor, backgroundColor: surfaceAltColor }}>
            <div className="mb-3 px-2">
              <p className="text-sm font-medium truncate" style={{ color: brandColor }}>{user.email}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-xs" style={{ color: textMutedColor }}>
                  {user.is_subscribed ? 'Premium' : `${t.newSession}: ${user.free_messages_left}/10`}
                </span>
                {user.is_subscribed && <Crown className="w-4 h-4" style={{ color: 'var(--color-premium)' }} />}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              {!user.is_subscribed && (
                <button
                  onClick={openPremium}
                  className="w-full py-2 rounded-[var(--radius-sm)] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  style={{ backgroundColor: 'var(--color-premium-bg)', color: 'var(--color-premium)' }}
                >
                  <Crown className="w-4 h-4" />
                  {language === 'ru' ? 'Подключить Premium' : 'Get Premium'}
                </button>
              )}
              <button
                onClick={logout}
                className="w-full py-2 rounded-[var(--radius-sm)] text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:opacity-80"
                style={{ color: textMutedColor }}
              >
                <LogOut className="w-4 h-4" />
                {language === 'ru' ? 'Выйти' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>

        {/* =================== Main Chat Area =================== */}
        <div className="flex-1 flex flex-col relative h-full" style={{ backgroundColor: surfaceColor }}>
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 z-20 border-b" style={{ backgroundColor: surfaceColor, borderColor: borderColor }}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 rounded-[var(--radius-sm)] transition-colors"
                style={{ color: brandColor }}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="font-serif font-medium text-lg" style={{ color: brandColor }}>Harmony</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-[var(--radius-sm)] transition-colors"
                style={{ color: brandColor }}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
                className="px-2 py-1.5 rounded-[var(--radius-sm)] text-[10px] font-semibold uppercase flex items-center gap-1"
                style={{ backgroundColor: surfaceAltColor, color: brandColor }}
              >
                <Globe className="w-3.5 h-3.5" />
                {language}
              </button>
              <button
                onClick={() => setIsSOSOpen(true)}
                className="p-1.5 rounded-[var(--radius-sm)] transition-colors"
                style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)' }}
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Status Header */}
          {activeChatId && (
            <div className="hidden md:flex absolute top-0 left-0 right-0 h-14 items-center px-8 z-10 backdrop-blur-sm border-b" style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface) 50%, transparent)', borderColor: borderColor }}>
              {user.is_subscribed ? (
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest flex items-center gap-2" style={{ backgroundColor: 'var(--color-premium-bg)', color: 'var(--color-premium)' }}>
                  <Crown className="w-3.5 h-3.5" /> {language === 'ru' ? 'Premium активен' : 'Premium Active'}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest" style={{ backgroundColor: surfaceAltColor, color: brandColor, border: `1px solid ${borderColor}` }}>
                  {language === 'ru' ? 'Бесплатных сообщений: ' : 'Free Messages: '}{user.free_messages_left}/10
                </span>
              )}
            </div>
          )}

          {/* Aurora backdrop — calm drifting waves behind messages */}
          <AuroraBackground />

          {/* =================== Messages =================== */}
          <div className="flex-1 overflow-y-auto pt-4 md:pt-[72px] pb-36 md:pb-40 px-4 md:px-8 max-w-4xl w-full mx-auto">
            {(!messages.length && activeChatId) ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 pt-10">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: surfaceAltColor, color: brandColor }}
                >
                  <MessageSquare className="w-9 h-9" />
                </motion.div>
                <div className="space-y-2">
                  <p className="font-serif font-medium text-xl" style={{ color: brandColor }}>{t.howAreYou}</p>
                  <p className="text-sm font-light max-w-xs mx-auto" style={{ color: textMutedColor }}>
                    {t.takeYourTime}
                  </p>
                </div>
                {/* Show quick replies in empty state */}
                <div className="flex flex-wrap justify-center gap-2 pt-2 max-w-md">
                  {t.quickReplies.slice(0, 3).map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(undefined, reply.full)}
                      className="px-3 py-2 rounded-full text-xs font-medium transition-all hover:scale-[1.03] active:scale-[0.97]"
                      style={{ backgroundColor: surfaceAltColor, color: brandColor, border: `1px solid ${borderColor}` }}
                    >
                      {reply.emoji} {reply.short}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-10">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                        {/* AI name label */}
                        {!isUser && (
                          <div className="flex items-center gap-2 mb-1.5 ml-1">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: brandColor, color: 'white' }}>
                              <Heart className="w-3 h-3 fill-current" />
                            </div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: textMutedColor }}>Harmony</span>
                          </div>
                        )}
                        <div
                          className={`rounded-[var(--radius-lg)] px-5 py-3.5 shadow-[var(--shadow-card)] ${
                            isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'
                          }`}
                          style={{
                            backgroundColor: isUser ? brandColor : surfaceAltColor,
                            color: isUser ? 'white' : textColor,
                          }}
                        >
                          <div className="whitespace-pre-wrap leading-relaxed font-light text-[15px]">{msg.content}</div>
                        </div>
                        {/* Timestamp */}
                        <span className="text-[10px] mt-1 mx-1" style={{ color: textMutedColor }}>
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing indicator */}
                {isSending && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2 mb-1.5 ml-1">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: brandColor, color: 'white' }}>
                          <Heart className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: textMutedColor }}>Harmony</span>
                      </div>
                      <div
                        className="rounded-[1.5rem] rounded-tl-none px-5 py-3.5 flex items-center gap-2 shadow-[var(--shadow-card)]"
                        style={{ backgroundColor: surfaceAltColor }}
                      >
                        <div className="flex gap-1.5">
                          {[0, 200, 400].map((delay) => (
                            <div
                              key={delay}
                              className="w-1.5 h-1.5 rounded-full animate-bounce"
                              style={{ backgroundColor: textMutedColor, animationDelay: `${delay}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* =================== Input Area =================== */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 border-t" style={{ backgroundColor: surfaceColor, borderColor: borderColor }}>
            <div className="max-w-4xl mx-auto relative">
              {/* Error toast */}
              <AnimatePresence>
                {sendError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-[110%] left-0 right-0 z-50 flex justify-center"
                  >
                    <ErrorBanner message={sendError} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Paywall modal */}
              <AnimatePresence>
                {isLocked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute bottom-[110%] left-0 right-0 z-50 flex items-center justify-center p-4"
                  >
                    <div className="w-full max-w-[400px] p-10 rounded-[var(--radius-xl)] shadow-[var(--shadow-elevated)] text-center" style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: surfaceAltColor, color: brandColor }}>
                        <AlertOctagon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-serif mb-3" style={{ color: brandColor }}>
                        {language === 'ru' ? 'Пробный период завершён' : 'Free Trial Completed'}
                      </h3>
                      <p className="text-sm leading-relaxed mb-8" style={{ color: textMutedColor }}>
                        {language === 'ru'
                          ? 'Вы использовали 10 бесплатных сообщений. Подключите Premium для безлимитных сессий.'
                          : "You've used your 10 free trial messages. Unlock unlimited sessions to continue your therapy journey."}
                      </p>
                      <Button onClick={openPremium} icon={Crown} fullWidth size="lg">
                        {language === 'ru' ? 'Подключить Premium' : 'Activate Premium'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick replies */}
              <div className="mb-3 flex flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {t.quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(undefined, reply.full)}
                    disabled={isSending || isLocked || !activeChatId}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: surfaceAltColor, color: brandColor, border: `1px solid ${borderColor}` }}
                  >
                    <span>{reply.emoji}</span>
                    <span>{reply.short}</span>
                  </button>
                ))}
              </div>

              {/* Input form */}
              <form onSubmit={sendMessage} className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isSending || isLocked || !activeChatId}
                  placeholder={isLocked ? (language === 'ru' ? 'Лимит достигнут...' : 'Limit reached...') : t.placeholder}
                  className="w-full h-12 py-3 pl-5 pr-14 rounded-[var(--radius-lg)] focus:outline-none transition-all text-sm"
                  style={{
                    backgroundColor: 'var(--color-input-bg)',
                    border: `2px solid ${borderColor}`,
                    color: textColor,
                  }}
                  onFocus={(e) => { e.target.style.borderColor = brandColor; e.target.style.backgroundColor = surfaceColor; }}
                  onBlur={(e) => { e.target.style.borderColor = borderColor; e.target.style.backgroundColor = 'var(--color-input-bg)'; }}
                />
                <div className="absolute right-2 top-1.5">
                  <button
                    type="submit"
                    disabled={isSending || isLocked || !input.trim() || !activeChatId}
                    className="h-9 w-9 flex items-center justify-center rounded-[var(--radius-md)] text-white transition-all disabled:opacity-50 hover:scale-[1.05] active:scale-95"
                    style={{ backgroundColor: isSending || isLocked || !input.trim() ? textMutedColor : brandColor }}
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>
              <p className="text-center text-[10px] mt-4 uppercase tracking-[0.2em] hidden sm:block" style={{ color: textMutedColor }}>
                {language === 'ru'
                  ? 'Основан на принципах когнитивно-поведенческой терапии • Зашифровано и безопасно'
                  : 'Guided by Cognitive Behavioral Principles • Encrypted & Secure'}
              </p>
            </div>
          </div>
        </div>

        {/* =================== Modals =================== */}
        <BreathingModal isOpen={isBreathingOpen} onClose={() => setIsBreathingOpen(false)} />
        <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
        <SoundModal isOpen={isSoundOpen} onClose={() => setIsSoundOpen(false)} />
        <CopingCardsModal isOpen={isCopingCardsOpen} onClose={() => setIsCopingCardsOpen(false)} />
        <SensoryCanvasModal isOpen={isSensoryOpen} onClose={() => setIsSensoryOpen(false)} />
        <PremiumModal
          isOpen={isPremiumOpen}
          onClose={() => setIsPremiumOpen(false)}
          onActivate={activatePremium}
          loading={isActivatingPremium}
        />
      </div>
    </PageTransition>
  );
}
