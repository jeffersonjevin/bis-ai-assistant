import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'verified' | 'seal' | 'alert' | 'neutral' | 'blue';
  icon?: ReactNode;
  className?: string;
}

const toneClasses: Record<string, string> = {
  verified: 'bg-verified-soft text-verified',
  seal: 'bg-seal-soft text-seal',
  alert: 'bg-alert-soft text-alert',
  neutral: 'bg-surface text-ink-soft',
  blue: 'bg-blue-light text-blue',
};

export default function Badge({ children, tone = 'neutral', icon, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
