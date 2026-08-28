import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  notched?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  hover = false,
  notched = false,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-surface-raised border border-line rounded-2xl shadow-[var(--shadow-card)] ${
        hover ? 'transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5' : ''
      } ${notched ? 'notch-corner' : ''} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
