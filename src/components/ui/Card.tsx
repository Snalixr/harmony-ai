import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  padding = true,
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-[var(--color-surface)]
        border border-[var(--color-border)]
        rounded-[var(--radius-xl)]
        shadow-[var(--shadow-card)]
        ${padding ? 'p-8 sm:p-10' : ''}
        ${hover ? 'hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-300' : ''}
        transition-shadow duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
