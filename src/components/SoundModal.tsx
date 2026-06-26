import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Square, Headphones, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

class BinauralSynth {
  ctx: AudioContext;
  oscL: OscillatorNode;
  oscR: OscillatorNode;
  panL: StereoPannerNode;
  panR: StereoPannerNode;
  gainNode: GainNode;

  constructor(targetWaveFreq: number) {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const baseFreq = 200;

    this.oscL = this.ctx.createOscillator();
    this.oscR = this.ctx.createOscillator();

    this.oscL.type = 'sine';
    this.oscR.type = 'sine';

    this.oscL.frequency.value = baseFreq;
    this.oscR.frequency.value = baseFreq + targetWaveFreq;

    this.panL = this.ctx.createStereoPanner();
    this.panL.pan.value = -1;

    this.panR = this.ctx.createStereoPanner();
    this.panR.pan.value = 1;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.5;

    this.oscL.connect(this.panL);
    this.panL.connect(this.gainNode);
    this.oscR.connect(this.panR);
    this.panR.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
  }

  start() {
    this.oscL.start();
    this.oscR.start();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 2);
  }

  stop() {
    this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    setTimeout(() => {
      this.oscL.stop();
      this.oscR.stop();
      this.ctx.close();
    }, 200);
  }
}

export default function SoundModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const synthRef = useRef<BinauralSynth | null>(null);
  const { t } = useLanguage();

  const FREQUENCIES = [
    { id: 'theta', name: t.theta, description: t.thetaDesc, waveId: 6 },
    { id: 'alpha', name: t.alpha, description: t.alphaDesc, waveId: 10 },
    { id: 'gamma', name: t.gamma, description: t.gammaDesc, waveId: 40 },
  ];

  useEffect(() => {
    if (!isOpen && synthRef.current) {
      synthRef.current.stop();
      synthRef.current = null;
      setActiveId(null);
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    };
  }, [isOpen]);

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

  const toggleSound = (id: string, waveFreq: number) => {
    if (activeId === id) {
      synthRef.current?.stop();
      synthRef.current = null;
      setActiveId(null);
    } else {
      if (synthRef.current) {
        synthRef.current.stop();
      }
      const newSynth = new BinauralSynth(waveFreq);
      newSynth.start();
      synthRef.current = newSynth;
      setActiveId(id);
    }
  };

  // Parse bold markers from soundInfo
  const soundInfoHtml = t.soundInfo.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

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
          aria-label={t.soundTherapy}
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
                <Headphones className="w-6 h-6 text-white" />
                <h2 className="text-xl font-serif font-medium">{t.soundTherapy}</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 overflow-y-auto no-scrollbar">
              <div className="flex items-start gap-3 p-4 rounded-[var(--radius-md)] text-sm shrink-0" style={{ backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-primary)' }}>
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p dangerouslySetInnerHTML={{ __html: soundInfoHtml }} />
              </div>

              <div className="space-y-4">
                {FREQUENCIES.map((freq) => (
                  <div key={freq.id} className="flex items-center justify-between p-4 rounded-[var(--radius-lg)]" style={{ backgroundColor: 'var(--color-surface-alt)', border: '1px solid var(--color-border)' }}>
                    <div className="pr-4">
                      <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{freq.name}</h3>
                      <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{freq.description}</p>
                    </div>

                    <button
                      onClick={() => toggleSound(freq.id, freq.waveId)}
                      className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-colors"
                      style={{
                        backgroundColor: activeId === freq.id ? 'var(--color-text)' : 'var(--color-surface)',
                        color: activeId === freq.id ? 'var(--color-surface)' : 'var(--color-primary)',
                        border: activeId === freq.id ? 'none' : '1px solid var(--color-border)',
                      }}
                    >
                      {activeId === freq.id ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
