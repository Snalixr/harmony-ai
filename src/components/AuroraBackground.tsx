/**
 * AuroraBackground — slow, meditative aurora waves for the chat area.
 *
 * Three large blurred layers drift on independent 30-45s cycles so the
 * motion never reads as a mechanical loop.  All interaction is suppressed
 * (pointer-events: none) and the component respects prefers-reduced-motion
 * (via the .aurora-layer rule in index.css).
 *
 * In light mode: multiply blend → soft warm staining over the surface.
 * In dark mode:  screen blend  → subtle green glow on dark surfaces.
 */
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LayerDef {
  gradient: string;
  animation: string;
  style: React.CSSProperties;
}

const LIGHT_LAYERS: LayerDef[] = [
  {
    gradient: 'radial-gradient(circle, #D4C5A9 0%, transparent 70%)',
    animation: 'aurora-drift-1 32s ease-in-out infinite',
    style: { width: '55%', height: '45%', top: '-10%', left: '-12%' },
  },
  {
    gradient: 'radial-gradient(circle, #B8C9BC 0%, transparent 70%)',
    animation: 'aurora-drift-2 44s ease-in-out infinite',
    style: { width: '50%', height: '40%', bottom: '-8%', right: '-14%' },
  },
  {
    gradient: 'radial-gradient(circle, #C8BFB0 0%, transparent 70%)',
    animation: 'aurora-drift-3 38s ease-in-out infinite',
    style: { width: '40%', height: '35%', top: '30%', left: '25%' },
  },
];

const DARK_LAYERS: LayerDef[] = [
  {
    gradient: 'radial-gradient(circle, #2A3630 0%, transparent 70%)',
    animation: 'aurora-drift-1 32s ease-in-out infinite',
    style: { width: '55%', height: '45%', top: '-10%', left: '-12%' },
  },
  {
    gradient: 'radial-gradient(circle, #2E3430 0%, transparent 70%)',
    animation: 'aurora-drift-2 44s ease-in-out infinite',
    style: { width: '50%', height: '40%', bottom: '-8%', right: '-14%' },
  },
  {
    gradient: 'radial-gradient(circle, #302C28 0%, transparent 70%)',
    animation: 'aurora-drift-3 38s ease-in-out infinite',
    style: { width: '40%', height: '35%', top: '30%', left: '25%' },
  },
];

export default function AuroraBackground() {
  const { resolvedTheme } = useTheme();
  const layers = resolvedTheme === 'dark' ? DARK_LAYERS : LIGHT_LAYERS;

  return (
    <div
      className="aurora-root absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {layers.map((l, i) => (
        <div
          key={i}
          className="aurora-layer"
          style={{ ...l.style, animation: l.animation, background: l.gradient }}
        />
      ))}
    </div>
  );
}
