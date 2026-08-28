import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-navy text-white hover:bg-navy-deep shadow-[0_2px_10px_-2px_rgba(11,36,71,0.45)]',
  secondary: 'bg-white text-navy border border-line hover:border-blue hover:text-blue',
  outline: 'bg-transparent text-navy border border-navy/20 hover:bg-blue-mist',
  ghost: 'bg-transparent text-ink-soft hover:bg-surface hover:text-ink',
};

const sizeClasses: Record<string, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3.5 gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, iconRight, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`focus-ring inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {icon}
        {children}
        {iconRight}
      </button>
    );
  }
);
Button.displayName = 'Button';
export default Button;
