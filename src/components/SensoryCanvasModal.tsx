import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function SensoryCanvasModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: {x: number, y: number, life: number, size: number, dx: number, dy: number}[] = [];
    let isDrawing = false;
    let animationFrameId: number;
    let lastX = 0;
    let lastY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const addParticle = (x: number, y: number, amount: number = 1) => {
      for (let i = 0; i < amount; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 10, 
          y: y + (Math.random() - 0.5) * 10, 
          life: 1, 
          size: Math.random() * 6 + 2,
          dx: (Math.random() - 0.5) * 1,
          dy: (Math.random() - 0.5) * 1
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDrawing) {
        // Interpolate points if moving fast
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const steps = Math.max(Math.floor(dist / 5), 1);
        
        for (let i = 0; i < steps; i++) {
          addParticle(lastX + (dx * i) / steps, lastY + (dy * i) / steps, 2);
        }
        
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDrawing = true;
      lastX = e.clientX;
      lastY = e.clientY;
      addParticle(e.clientX, e.clientY, 5);
    };

    const handlePointerUp = () => {
      isDrawing = false;
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerout', handlePointerUp);

    const render = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      // Clear entirely, particles handle their own fade via 'life'
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Pure glowing white trace
        const alpha = p.life;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha})`;
        
        ctx.fill();

        p.life -= 0.012; // fade out speed
        p.x += p.dx;
        p.y += p.dy;
        p.size *= 0.98; // shrink gradually
      }

      particles = particles.filter(p => p.life > 0.05);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerout', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  // ESC to close + lock scroll
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#0a0a0a] touch-none"
          role="dialog"
          aria-modal="true"
          aria-label="Sensory canvas"
        >
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 cursor-crosshair touch-none"
            style={{ touchAction: 'none' }}
          />
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
