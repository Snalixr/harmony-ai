import React from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  // Explicit HTML attributes often used by callers
  id?: string;
  className?: string;
  type?: string;
  [key: string]: any;
}

export default function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium ml-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-5 py-4
          rounded-[var(--radius-lg)]
          bg-[var(--color-input-bg)]
          border-2 border-[var(--color-border)]
          text-[var(--color-text)]
          placeholder:text-[var(--color-text-muted)]
          focus:bg-[var(--color-surface)]
          focus:border-[var(--color-primary)]
          focus:outline-none
          transition-all duration-200
          ${error ? 'border-red-400 focus:border-red-500' : ''}
          ${className}
        `}
        style={{ backgroundColor: 'var(--color-input-bg)' }}
        {...props}
      />
    </div>
  );
}
