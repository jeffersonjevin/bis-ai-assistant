import type { ButtonHTMLAttributes } from 'react';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export default function Chip({ active = false, className = '', children, ...props }: ChipProps) {
  return (
    <button
      className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
        active
          ? 'bg-navy text-white border-navy'
          : 'bg-white text-ink-soft border-line hover:border-blue hover:text-blue'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
