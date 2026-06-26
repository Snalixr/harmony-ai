import React from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

/**
 * Wraps page content with a fade+slide entrance animation.
 * Use in every page's root element.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
