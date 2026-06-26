import React from 'react';

interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      className="mb-6 p-4 rounded-[var(--radius-md)] text-sm font-medium text-center border"
      style={{
        backgroundColor: 'var(--color-danger-bg)',
        color: 'var(--color-danger-text)',
        borderColor: 'var(--color-danger-border)',
      }}
    >
      {message}
    </div>
  );
}
